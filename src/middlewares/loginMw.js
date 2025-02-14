import { loginSchema } from "../schemas/loginSchema.js";
import { safeParse } from "valibot";

export const invalidRequestFormatMessage = 'Invalid request format. Expected application/json.';
export const mustEnterBothFieldsMessage = 'You must enter both fields to login.';

export function validateLoginFieldsMw(req, res, next) {
    
    if (!req.is("application/json")) {
        return res.status(400).json({
            success: false,
            message: invalidRequestFormatMessage
        });
    }

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: mustEnterBothFieldsMessage
        });
    }

    next();
}

export function sanitizeLoginMw(req, res, next) {
    const loginData = req.body;
    const result = safeParse(loginSchema, loginData);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.issues[0].message
        })
    }
    
    next();
}