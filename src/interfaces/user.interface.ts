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
    quizzesTaken: number;
    quizzesCompleted: number;
    totalScore: number;
    highestScore: number;
    totalCorrectAnswers: number;
    totalAnswersGiven: number;
    bestCategory: string;
    rank: string;
    level: number;
    achievements: string[];
    categoryScores: Record<string, number>;
    wisdom: number;
}

export interface IQuizResult {
    quizId: string;
    category: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    completedAt: Date;
}
