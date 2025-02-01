import { pipe, string, nonEmpty, email, minLength, maxLength } from "valibot";

export const emailSchema = pipe(
    string(),
    nonEmpty('Please enter your email.'),
    email('The email is badly formatted.'),
    maxLength(254, 'Your email is too long.')
);

export const passwordSchema = pipe(
    string(),
    nonEmpty('Please enter your password.'),
    minLength(6, "Password must have 6 characters at least.")
);