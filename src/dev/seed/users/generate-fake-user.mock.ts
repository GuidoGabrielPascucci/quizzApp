import { faker } from "@faker-js/faker";
import { IQuizResult, IUser } from "../../../interfaces/index.js";
import { mockQuizResults } from "./quiz-results.mock.js";
import { completarStats } from "./user-stats.mock.js";
import { hashSync } from "bcrypt";
import {
    IncompleteStats,
    RandomIncompleteUser,
    UserLoginData,
    UserRelatedData,
} from "./utils.mock.js";

// Generador de usuarios falsos
export const generateFakeUser = (usersDataForJson: UserLoginData[]): IUser => {
    const incompleteUser = getFakerRandomData();

    // AGARRO EL EMAIL Y LA CONTRASEÑA SIN HASHEAR Y LO GUARDO EN UN OBJETO QUE IRÁ A UN ARCHIVO JSON
    usersDataForJson.push({
        email: incompleteUser.email,
        password: incompleteUser.passwordPlainText,
    });

    const quizzResults = mockQuizResults(incompleteUser.stats.quizzesCompleted);
    const someStats = completarStats(quizzResults);

    const incompleteStats: IncompleteStats = {
        ...incompleteUser.stats,
        ...someStats,
    };

    const { stats, ...userWithoutStats } = incompleteUser;

    const userRelatedData: UserRelatedData = {
        user: userWithoutStats,
        stats: incompleteStats,
        quizzResults,
    };

    return getFinalRandomUser(userRelatedData);
};

function getFakerRandomData(): RandomIncompleteUser {
    return {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        passwordPlainText: faker.internet.password(),
        createdAt: faker.date.past(),
        avatar: faker.image.avatarGitHub(),
        stats: {
            quizzesCompleted: faker.number.int({ min: 1, max: 5 }),
            rank: faker.helpers.arrayElement([
                "Beginner",
                "Intermediate",
                "Advanced",
            ]),
            level: faker.number.int({ min: 1, max: 50 }),
            achievements: faker.helpers.arrayElements(
                ["First Quiz", "Perfect Score", "Quiz Master", "Fast Thinker"],
                faker.number.int({ min: 0, max: 4 })
            ),
        },
    };
}

function getFinalRandomUser(data: UserRelatedData): IUser {
    return {
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        username: data.user.username,
        email: data.user.email,
        password: hashSync(data.user.passwordPlainText ?? "", 10),
        createdAt: data.user.createdAt,
        avatar: data.user.avatar,
        stats: {
            quizzesTaken: data.stats.quizzesCompleted * 2,
            totalAnswersGiven: Array.from(
                data.quizzResults,
                (v: IQuizResult) => v.totalQuestions
            ).reduce((prev, curr) => prev + curr),
            quizzesCompleted: data.stats.quizzesCompleted,
            totalScore: data.stats.totalScore,
            highestScore: data.stats.highestScore,
            totalCorrectAnswers: data.stats.totalCorrectAnswers,
            bestCategory: data.stats.bestCategory,
            rank: data.stats.rank,
            level: data.stats.level,
            achievements: data.stats.achievements,
            categoryScores: data.stats.categoryScores,
        },
        quizHistory: data.quizzResults,
    };
}
