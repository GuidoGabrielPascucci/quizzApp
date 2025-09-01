import jwt from "jsonwebtoken";
import { UserDocument } from "@models/user.model.js";
import { UserDTO } from "@_types/user.types.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export function sanitizeUserForResponse(createdUser: UserDocument) {
    const createdUserPlainObj = createdUser.toObject() as any;
    delete createdUserPlainObj.password;
    delete createdUserPlainObj.__v;
    return createdUserPlainObj;
}

export function getSignupData(req: any) {
    return {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };
}

export function signToken(user: any): string {
    const payload = {
        userId: user._id,
        userEmail: user.email,
    };
    const options = {
        expiresIn: 3600,
    };
    return jwt.sign(payload, JWT_SECRET_KEY, options);
}

export const invalidDataResponseObject = {
    success: false,
    message: "Datos inválidos.",
};

export const mapUserToResponse = (user: UserDocument): UserDTO => ({
    id: user._id.toString(),
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    avatar: user.avatar ?? "",
    stats: user.stats ?? {
        totalScore: 0,
        totalCorrectAnswers: 0,
        totalAnswersGiven: 0,
        quizzesCompleted: 0,
        highestScore: 0,
        bestCategory: "",
        categoryScores: {},
    },
    quizHistory: user.quizHistory,
});
