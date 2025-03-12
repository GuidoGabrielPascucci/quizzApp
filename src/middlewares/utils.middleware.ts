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
): any {
    if (req.headers["content-type"] !== "application/json") {
        return res.status(400).json({
            success: false,
            message: invalidRequestFormatMessage,
        });
    }
    next();
}
