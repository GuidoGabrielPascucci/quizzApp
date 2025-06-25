// LOGIN imports
import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../schemas/login.schema.js";
import { safeParse } from "valibot";
import { msg_mustEnterAllFieldsToLogin } from "./utils.middleware.js";
// SIGNUP imports
import { signupSchema } from "../schemas/signup.schema.js";
import {
    getSignupData,
    invalidDataResponseObject,
} from "../utils/user.utils.js";
import { msg_mustEnterAllFieldsToSignup } from "./utils.middleware.js";
import { UserStatsSchema } from "../schemas/users/validation.schema.js";

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

export function validateUpdateStatsInputs(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const result = safeParse(UserStatsSchema, req.body);
    if (!result.success) {
        res.status(400).json(invalidDataResponseObject);
        return;
    }
    req.body = result.output;
    next();
}
