// import { loginSchema } from "../schemas/loginSchema.js";

import { safeParse } from "valibot";

export function validateSignupFieldsMw(req, res, next) {
    if (req.body.firstName && req.body.lastName && req.body.email && req.body.password) {
        next();
        return;
    }
    res.status(400).json({
        success: false,
        message: "You must enter all fields to signup."
    })
}

export function sanitizeSignupMw(req, res, next) {
    const signupData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };
    const result = safeParse(signupSchema, signupData);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.issues[0].message
        })
        return;
    }
    next();
}