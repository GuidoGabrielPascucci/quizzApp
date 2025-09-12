import { NextFunction, Request, Response } from "express";
import { safeParse } from "valibot";
import { signupSchema } from "@schemas/users/signup.schema.js";
import { UserStatsSchema } from "@schemas/users/validation.schema.js";
import { getSignupData, invalidDataResponseObject } from "@utils/user.utils.js";
import { mustEnterAllFieldsToSignupMessage } from "../utils.middleware.js";

export function validateSignupFieldsMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const signupData = getSignupData(req);

    if (Object.values(signupData).some((value) => value === undefined)) {
        res.status(400).json({
            success: false,
            message: mustEnterAllFieldsToSignupMessage,
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
        // if (process.env.NODE_ENV === "production") {
        //     res.status(400).json({
        //         success: false,
        //         message: "Invalid data",
        //     });
        // }
        res.status(400).json({
            success: false,
            message: result.issues[0].message,
        });

        // message: result.issues[0].message,
        // message: result.issues.map((issue) => issue.message).join(", "),

        return;
    }

    next();
}
