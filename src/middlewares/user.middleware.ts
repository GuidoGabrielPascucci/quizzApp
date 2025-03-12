// LOGIN imports
import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../schemas/login.schema.js";
import { safeParse } from "valibot";
import { msg_mustEnterAllFieldsToLogin } from "./utils.middleware.js";
// SIGNUP imports
import { signupSchema } from "../schemas/signup.schema.js";
import { getSignupData } from "../utils/user.utils.js";
import { msg_mustEnterAllFieldsToSignup } from "./utils.middleware.js";

export function validateLoginFieldsMw(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: msg_mustEnterAllFieldsToLogin,
        });
    }
    next();
}

export function sanitizeLoginMw(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const loginData = req.body;
    const result = safeParse(loginSchema, loginData);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.issues[0].message,
        });
    }
    next();
}

// SIGNUP
export function validateSignupFieldsMw(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const signupData = getSignupData(req);
    if (Object.values(signupData).some((value) => value === undefined)) {
        return res.status(400).json({
            success: false,
            message: msg_mustEnterAllFieldsToSignup,
        });
    }
    next();
}

export function sanitizeSignupMw(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const signupData = getSignupData(req);
    const result = safeParse(signupSchema, signupData);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.issues[0].message,
        });
    }
    next();
}
