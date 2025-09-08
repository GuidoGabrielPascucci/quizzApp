import { compare, hash } from "bcrypt";
import User, { UserDocument } from "@models/user.model.js";
import {
    mapUserToResponse,
    sanitizeUserForResponse,
    signToken,
} from "@utils/user.utils.js";
import {
    AuthResponse,
    // LoginResult,
    UserDTO,
    UserSignupData,
    UserStatsNewData,
} from "@_types/user.types.js";
import { IUserDocument } from "@interfaces/mongoose.interface.js";
import { ConflictError, UnauthorizedError } from "@errors";
import { invalidCredentialsMessage } from "@schemas/users/login.schema.js";
import { userAlreadyExistsMessage } from "@schemas/users/signup.schema.js";

class UserService {
    login = async (email: string, password: string): Promise<AuthResponse> => {
        const user: UserDocument | null = await User.findOne({ email }).select(
            "+password"
        );

        if (!user || !(await compare(password, user.password))) {
            throw new UnauthorizedError(invalidCredentialsMessage);
        }

        const accessToken = signToken(user);
        const userDTO = mapUserToResponse(user);

        return { accessToken, user: userDTO };
    };

    signup = async (user: UserSignupData): Promise<AuthResponse> => {
        const userExist = await this.findByEmail(user.email);

        if (userExist) {
            throw new ConflictError(userAlreadyExistsMessage);
        }

        const hashedPassword = await hash(user.password, 10);

        const userWithHashedPassword = {
            ...user,
            password: hashedPassword,
        };

        await User.create(userWithHashedPassword);

        return this.login(user.email, user.password);
    };

    findByEmail = async (email: string): Promise<UserDocument | null> => {
        const user = await User.findOne({ email });
        return user;
    };

    findById = async (id: string): Promise<UserDocument | null> => {
        const user = await User.findById(id);
        return user;
    };

    updateStats = async (stats: UserStatsNewData): Promise<any> => {
        const user = await this.findById(stats.userId);

        if (!user) {
            throw new Error("No existe dicho usuario");
        }

        user.stats.totalScore += stats.score;
        user.stats.totalCorrectAnswers += stats.correctAnswers;
        user.stats.totalAnswersGiven += stats.totalQuestions;
        user.stats.quizzesCompleted++;

        if (stats.score > user.stats.highestScore) {
            user.stats.highestScore = stats.score;
        }

        this.updateCategoryScores(user, stats);
        this.updateBestCategory(user);

        await user.save();
    };

    updateCategoryScores(user: IUserDocument, stats: UserStatsNewData) {
        // ACTUALIZA O INICIALIZA CATEGORY SCORES
        if (!user.stats.categoryScores) {
            user.stats.categoryScores = {};
        }
        if (!user.stats.categoryScores[stats.category]) {
            user.stats.categoryScores[stats.category] = 0;
        }
        user.stats.categoryScores[stats.category] += stats.score;
    }

    updateBestCategory(user: IUserDocument) {
        // Actualizar la mejor categoría
        const categoryScoresEntries = Object.entries(user.stats.categoryScores);
        const categoryScoresEntriesSorted = categoryScoresEntries.sort(
            (a, b) => b[1] - a[1]
        ); // Ordena de mayor a menor
        user.stats.bestCategory = categoryScoresEntriesSorted[0][0]; // Toma la primera categoria
    }
}

export default UserService;
