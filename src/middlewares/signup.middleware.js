import { safeParse } from "valibot";
import { signupSchema } from "../schemas/signup.schema.js";
import { getSignupData } from "../utils/user.utils.js";
import { msg_mustEnterAllFieldsToSignup } from "./utils.middlware.js";

export function validateSignupFieldsMw(req, res, next) {
    const signupData = getSignupData(req);
    if (Object.values(signupData).some(value => value === undefined)) {
        return res.status(400).json({
            success: false,
            message: msg_mustEnterAllFieldsToSignup
        });
    }
    next();
}

export function sanitizeSignupMw(req, res, next) {
    const signupData = getSignupData(req);
    const result = safeParse(signupSchema, signupData);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.issues[0].message
        });
    }
    next();
}