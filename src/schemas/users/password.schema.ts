import { pipe, string, nonEmpty, minLength, maxLength, custom } from "valibot";

export const passwordSchema = pipe(
    string(),
    nonEmpty("Password is required, can not be empty."),
    minLength(8, "Password must be at least 8 characters long."),
    maxLength(24, "Password must be at most 24 characters long."),
    custom<string>((val) => {
        if (typeof val !== "string") return false;

        return (
            /[A-Z]/.test(val) && // at least one uppercase letter
            /[a-z]/.test(val) && // at least one lowercase letter
            /\d/.test(val) && // at least one number
            /[^A-Za-z0-9]/.test(val) // at least one symbol
        );
    }, "Password must include uppercase, lowercase, number and symbol.")
);
