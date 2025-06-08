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

        // TODO: Implementar lógica para actualizar rank, level y achievements

        // let wisdom = 0;
        // wisdom += stats.score;
        // if (wisdom >= 100) {
        //     user.stats.level++;
        //     wisdom -= 100;
        // }

        const getRequiredWisdomForNextLevel = (level: number): number => {
            return 100 + level * 10; // Ejemplo: aumenta la dificultad con el nivel
        };

        user.stats.wisdom += stats.score;

        const requiredWisdom = getRequiredWisdomForNextLevel(user.stats.level);
        if (user.stats.wisdom >= requiredWisdom) {
            user.stats.level += Math.floor(user.stats.wisdom / requiredWisdom);
            user.stats.wisdom %= requiredWisdom;
        }

        console.log("sucedio");

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

    /* 
    updateStats = async (stats: UserStatsNewData) => {
        const user = await this.findById(stats.userId);
    
        if (!user) {
            throw new Error("No existe dicho usuario");
        }
    
        // Asegurar que user.stats esté definido
        if (!user.stats) {
            user.stats = {
                totalScore: 0,
                totalCorrectAnswers: 0,
                totalAnswersGiven: 0,
                quizzesCompleted: 0,
                highestScore: 0,
                bestCategory: "",
                rank: "Novato",
                level: 1,
                achievements: [],
            };
        }
    
        // Validaciones
        if (stats.correctAnswers > stats.totalQuestions) {
            throw new Error("Las respuestas correctas no pueden ser mayores que las preguntas totales.");
        }
    
        if (stats.totalQuestions <= 0) {
            throw new Error("No se puede completar un quiz sin responder preguntas.");
        }
    
        // Actualización de stats
        user.stats.totalScore += stats.score;
        user.stats.totalCorrectAnswers += stats.correctAnswers;
        user.stats.totalAnswersGiven += stats.totalQuestions;
        user.stats.quizzesCompleted++;
    
        if (stats.score > user.stats.highestScore) {
            user.stats.highestScore = stats.score;
        }
    
        // TODO: Implementar lógica para actualizar bestCategory y rank
    
        await user.save();
    }; */
}

export default UserService;
