import { compare, hash } from "bcrypt";
import User from "../models/user.model.js";
import { sanitizeUserForResponse, signToken } from "../utils/user.utils.js";
import { UserSignupData, UserStatsNewData } from "../types/user.types.js";
import { IUserDocument } from "../interfaces/mongoose.interface.js";

class UserService {
    login = async (email: string, password: string) => {
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await compare(password, user.password))) {
            return false;
        }
        const accessToken = signToken(user);
        return accessToken;
    };

    signup = async (user: UserSignupData) => {
        const hashedPassword = await hash(user.password, 10);
        const userWithHashedPassword = {
            ...user,
            password: hashedPassword,
        };
        const createdUser = await User.create(userWithHashedPassword);
        const newUserDTO = sanitizeUserForResponse(createdUser);
        return newUserDTO;
    };

    findByEmail = async (email: string) => {
        const user = await User.findOne({ email });
        return user;
    };

    findById = async (id: string) => {
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
