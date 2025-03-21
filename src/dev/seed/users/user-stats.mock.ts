import { IQuizResult } from "../../../interfaces/index.js";

export function completarStats(quizHistory: IQuizResult[]) {
    const categoryScores: Record<string, number> = {};

    let totalScore = 0;
    let totalCorrectAnswers = 0;
    let totalQuestions = 0;
    let highestScore = 0;

    for (let i = 0; i < quizHistory.length; i++) {
        const quizResults: IQuizResult = quizHistory[i];
        totalScore += quizResults.score;
        totalCorrectAnswers += quizResults.correctAnswers;
        totalQuestions += quizResults.totalQuestions;
        assingScoreToCategories(
            quizResults.category,
            quizResults.score,
            categoryScores
        );
        if (quizResults.score > highestScore) highestScore = quizResults.score;
    }

    const bestCategoryWithScore = Object.entries(categoryScores).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max)
    );
    const bestCategory: string = bestCategoryWithScore[0];

    return {
        totalScore,
        totalCorrectAnswers,
        totalQuestions,
        highestScore,
        bestCategory,
        categoryScores,
    };
}

function assingScoreToCategories(
    category: string,
    score: number,
    categoryScores: Record<string, number>
) {
    if (!(category in categoryScores)) {
        categoryScores[category] = 0;
    }
    categoryScores[category] += score;
}
