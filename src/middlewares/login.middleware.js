import { loginSchema } from "../schemas/login.schema.js";
import { safeParse } from "valibot";
import { msg_mustEnterAllFieldsToLogin } from "./utils.middlware.js";

export function validateLoginFieldsMw(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: msg_mustEnterAllFieldsToLogin
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