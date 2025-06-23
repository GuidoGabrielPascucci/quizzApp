// LOGIN imports
import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../schemas/login.schema.js";
//import { safeParse } from "valibot";
import {
    object,
    string,
    number,
    date,
    safeParse,
    pipe,
    nonEmpty,
    minValue,
    maxValue,
} from "valibot";
import { msg_mustEnterAllFieldsToLogin } from "./utils.middleware.js";
// SIGNUP imports
import { signupSchema } from "../schemas/signup.schema.js";
import { getSignupData } from "../utils/user.utils.js";
import { msg_mustEnterAllFieldsToSignup } from "./utils.middleware.js";
import { UserStatsNewData } from "../types/user.types.js";

export function validateLoginFieldsMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            success: false,
            message: msg_mustEnterAllFieldsToLogin,
        });
        return;
    }
    next();
}

export function sanitizeLoginMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const loginData = req.body;
    const result = safeParse(loginSchema, loginData);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.issues[0].message,
        });
        return;
    }
    next();
}

// SIGNUP
export function validateSignupFieldsMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const signupData = getSignupData(req);
    if (Object.values(signupData).some((value) => value === undefined)) {
        res.status(400).json({
            success: false,
            message: msg_mustEnterAllFieldsToSignup,
        });
        return;
    }
    next();
}

export function sanitizeSignupMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const signupData = getSignupData(req);
    const result = safeParse(signupSchema, signupData);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.issues[0].message,
        });
        return;
    }
    next();
}

// UPDATE STATS
// export function validateUpdateStatsInputs(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): void {
//     const body: UserStatsNewData = req.body;
//     if (
//         !body.quizId ||
//         !body.userId ||
//         !body.category ||
//         !body.score ||
//         !body.totalQuestions ||
//         !body.correctAnswers ||
//         !body.completionTime ||
//         !body.completedAt
//     ) {
//         res.status(400).json({
//             success: false,
//             message: "No has ingresado todos los campos",
//         });
//         return;
//     }
//     next();
// }

export const invalidDataResponseObject = {
    success: false,
    message: "Datos inválidos.",
    //issues: result.issues, // Te da el detalle del error
};

const UserStatsSchema = object({
    userId: pipe(string(), nonEmpty()),
    quizId: pipe(string(), nonEmpty()),
    category: pipe(string(), nonEmpty()),
    score: pipe(number(), minValue(0), maxValue(500)),
    correctAnswers: pipe(number(), minValue(0), maxValue(30)),
    totalQuestions: pipe(number(), minValue(1), maxValue(30)),
    completedAt: pipe(date(), minValue(new Date())),
    completionTime: pipe(number(), minValue(1)),
});

export function validateUpdateStatsInputs(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const result = safeParse(UserStatsSchema, req.body);

    // console.log(result);

    if (!result.success) {
        res.status(400).json(invalidDataResponseObject);
        return;
    }

    // (opcional) reemplazar body con datos parseados y tipados
    req.body = result.output;

    next();
}
