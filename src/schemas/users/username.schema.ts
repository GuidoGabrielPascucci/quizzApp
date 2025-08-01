import { pipe, string, nonEmpty, minLength, maxLength, custom } from "valibot";

export const usernameSchema = pipe(
    string(),
    nonEmpty("Username is required, can not be empty."),
    minLength(3, "Username must be at least 3 characters long."),
    maxLength(20, "Username must be at most 20 characters long."),
    custom<string>(
        (val) => /^[a-zA-Z0-9_.]+$/.test(val as string),
        "Username can only contain letters, numbers, underscores and dots."
    )
);
