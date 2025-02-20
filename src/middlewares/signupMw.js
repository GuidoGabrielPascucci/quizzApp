import { safeParse } from "valibot";
import { signupSchema } from "../schemas/signupSchema.js";
import { getSignupData } from "../utils/user.utils.js";

export function validateSignupFieldsMw(req, res, next) {
    const signupData = getSignupData(req);
    
    if (Object.values(signupData).some(value => value === undefined)) {
        return res.status(400).json({
            success: false,
            message: "You must enter all fields to signup."
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