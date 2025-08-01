import { pipe, string, nonEmpty, email, minLength, maxLength } from "valibot";

export const emailSchema = pipe(
    string(),
    nonEmpty("Please enter your email."),
    email("The email is badly formatted."),
    minLength(5, "Your email is too short"),
    maxLength(254, "Your email is too long.")
);
