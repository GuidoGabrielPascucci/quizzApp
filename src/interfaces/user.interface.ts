export interface IUser {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    avatar?: string;
    stats: IUserStats;
    quizHistory: IQuizResult[];
}

export interface IUserStats {
    totalScore: number;
    totalCorrectAnswers: number;
    totalAnswersGiven: number;
    quizzesCompleted: number;
    highestScore: number;
    bestCategory: string;
    categoryScores: Record<string, number>;
}

export interface IQuizResult {
    quizId: string;
    category: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    completedAt: Date;
}
