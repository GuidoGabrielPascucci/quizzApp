export type UserSignupData = {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
};

export type UserStatsNewData = {
    quizId: string;
    userId: string;
    category: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    completionTime: number;
    completedAt: Date;
};
