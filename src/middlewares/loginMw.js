import { loginSchema } from "../schemas/loginSchema.js";
import { safeParse } from "valibot";

export function validateLoginFieldsMw(req, res, next) {
    if (req.body.email && req.body.password) {
        next();
        return;
    }
    res.status(400).json({
        success: false,
        message: "You must enter both fields to login."
    })
}

export function sanitizeLoginMw(req, res, next) {
    const loginData = {
        email: req.body.email,
        password: req.body.password
    };
    const result = safeParse(loginSchema, loginData);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.issues[0].message
        })
        return;
    }
    next();
}