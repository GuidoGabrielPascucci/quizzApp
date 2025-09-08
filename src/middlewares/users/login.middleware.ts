import { Request, Response, NextFunction } from "express";
import { safeParse } from "valibot";
import { loginSchema } from "@schemas/users/login.schema.js";
import { mustEnterAllFieldsToLoginMessage } from "../utils.middleware.js";

export function validateLoginFieldsMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            success: false,
            message: mustEnterAllFieldsToLoginMessage,
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
    const result = safeParse(loginSchema, req.body);

    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.issues[0].message,
        });

        return;
    }

    next();
}
