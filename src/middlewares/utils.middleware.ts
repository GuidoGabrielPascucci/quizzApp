import { Request, Response, NextFunction } from "express";

const msg_mustEnterAllFieldsTo = "You must enter all fields to";
export const msg_mustEnterAllFieldsToLogin = `${msg_mustEnterAllFieldsTo} login.`;
export const msg_mustEnterAllFieldsToSignup = `${msg_mustEnterAllFieldsTo} signup.`;
export const invalidRequestFormatMessage =
    "Invalid request format. Expected application/json.";

export function validateRequestFormatMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.log("1. validate request format MW");

    if (req.headers["content-type"] !== "application/json") {
        console.log("Content-Type erróneo");

        res.status(400).json({
            success: false,
            message: invalidRequestFormatMessage,
        });

        return;
    }

    next();
}
