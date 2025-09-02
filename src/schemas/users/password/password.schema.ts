import { pipe, string, nonEmpty, minLength, maxLength, custom } from "valibot";
import { passwordMessages, passwordLimits } from "./password.constants.js";

export const passwordSchema = pipe(
    string(),
    nonEmpty(passwordMessages.emptyField),
    minLength(passwordLimits.min, passwordMessages.tooShort),
    maxLength(passwordLimits.max, passwordMessages.tooLong),
    custom<string>((val) => {
        if (typeof val !== "string") return false;

        return (
            /[A-Z]/.test(val) && // at least one uppercase letter
            /[a-z]/.test(val) && // at least one lowercase letter
            /\d/.test(val) && // at least one number
            /[^A-Za-z0-9]/.test(val) // at least one symbol
        );
    }, passwordMessages.invalidFormat)
);
