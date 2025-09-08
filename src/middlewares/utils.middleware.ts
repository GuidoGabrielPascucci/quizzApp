import { Request, Response, NextFunction } from "express";

const mustEnterAllFieldsTo = "You must enter all fields to";
export const mustEnterAllFieldsToLoginMessage = `${mustEnterAllFieldsTo} login.`;
export const mustEnterAllFieldsToSignupMessage = `${mustEnterAllFieldsTo} signup.`;
export const invalidRequestFormatMessage =
    "Invalid request format. Expected application/json.";

export function validateRequestFormatMw(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (req.headers["content-type"] !== "application/json") {
        res.status(400).json({
            success: false,
            message: invalidRequestFormatMessage,
        });

        return;
    }

    next();
}
