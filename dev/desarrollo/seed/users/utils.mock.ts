import { IQuizResult, IUserStats } from "@interfaces/index.js";

export type UserLoginData = { email: string; password: string };

export type RandomIncompleteUser = BaseUser & {
    passwordPlainText: string;
    stats: {
        quizzesCompleted: number;
    };
};

export type UserWithoutStats = Omit<RandomIncompleteUser, "stats">;

export type UserRelatedData = {
    user: UserWithoutStats;
    stats: IncompleteStats;
    quizzResults: IQuizResult[];
};

export type IncompleteStats = Omit<
    IUserStats,
    "quizzesTaken" | "totalAnswersGiven"
>;

type BaseUser = {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    createdAt: Date;
    avatar: string;
};
