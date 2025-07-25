import { IUser } from "../interfaces/user.interface.js";
// import { UserDocument } from "../models/user.model.js";

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

export type UserDTO = Omit<IUser, "password" | "avatar"> & {
    id: string;
    avatar: string;
};

export type AuthResponse = {
    accessToken: string;
    user: UserDTO;
};
