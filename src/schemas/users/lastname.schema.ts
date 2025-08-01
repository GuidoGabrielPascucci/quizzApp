import { pipe, string, nonEmpty, minLength, maxLength } from "valibot";

export const lastnameSchema = pipe(
    string(),
    nonEmpty("Last name is required, can not be empty."),
    minLength(2, "Last name must be at least 2 characters long."),
    maxLength(50, "Last name must be at most 50 characters long.")
);
