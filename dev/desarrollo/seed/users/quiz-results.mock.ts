import { faker } from "@faker-js/faker";
import { IQuizResult } from "@interfaces/index.js";

// Generar un array de Resultados de Quizzes (con N elementos)
export const mockQuizResults = (count: number): IQuizResult[] => {
    return Array.from({ length: count }, generateQuizResult);
};

// Función para generar un objeto de tipo IQuizResult
const generateQuizResult = (): IQuizResult => {
    const totalQuestions = faker.helpers.arrayElement<number>([10, 15, 20]); // Total de preguntas
    const correctAnswers = faker.number.int({ min: 0, max: totalQuestions }); // Respuestas correctas aleatorias
    const score = calculateScore(totalQuestions, correctAnswers);
    return {
        quizId: faker.database.mongodbObjectId(),
        category: faker.helpers.arrayElement([
            "Math",
            "Science",
            "History",
            "Geography",
            "Programming",
            "Economy",
            "Law",
        ]),
        totalQuestions,
        correctAnswers,
        score,
        completedAt: faker.date.past(),
    };
};

function calculateScore(totalQuestions: number, correctAnswers: number) {
    return Number(((correctAnswers / totalQuestions) * 100).toFixed(0));
}
