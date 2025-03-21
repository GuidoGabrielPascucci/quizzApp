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

    updateStats = async (stats: UserStatsNewData) => {
        const user = await this.findById(stats.userId);

        if (!user) {
            throw new Error("No existe dicho usuario");
        }

        // En el Historial de Quizzes jugados del usuario tiene que aparecer el Quiz que acaba de jugar dicho usuario
        // con el score que anotó, la cantidad de respuestas correctas, y la fecha en que lo jugó.
        // Opcional: un resultado en dicho quizz, por ejemplo si anotó:
        // 0 respuestas correctas ---> MUY MALARDO
        // 1 a 3 respuestas correctas ---> MALARDO
        // 3 a 6 respuestas correctas ---> VAS EN CAMINO
        // 6 a 9 respuestas correctas ---> APROBADO
        // 10 respuestas correctas ---> ANIMAL

        // También podría hacer un medallero, o trofeos:
        // Medalla de Madera
        // Medalla de bronce
        // Medalla de plata
        // Medalla de oro

        user.stats.totalScore += stats.score;
        user.stats.totalCorrectAnswers += stats.correctAnswers;
        user.stats.totalAnswersGiven += stats.totalQuestions;
        user.stats.quizzesCompleted++;

        if (stats.score > user.stats.highestScore) {
            user.stats.highestScore = stats.score;
        }

        // TODO: Implementar lógica para actualizar bestCategory y rank

        await user.save();
    };

    logicaBestCategory(user: IUserDocument, stats: UserStatsNewData) {
        if (!user.stats.categoryScores) {
            user.stats.categoryScores = {};
        }

        if (!user.stats.categoryScores[stats.category]) {
            user.stats.categoryScores[stats.category] = 0;
        }

        user.stats.categoryScores[stats.category] += stats.score;

        // Actualizar la mejor categoría
        user.stats.bestCategory = Object.entries(
            user.stats.categoryScores
        ).sort((a, b) => b[1] - a[1])[0][0]; // Ordena de mayor a menor y toma la primera
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
