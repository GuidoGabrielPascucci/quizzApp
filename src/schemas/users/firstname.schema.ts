import { pipe, string, nonEmpty, minLength, maxLength } from "valibot";

export const firstnameSchema = pipe(
    string(),
    nonEmpty("First name is required, can not be empty."),
    minLength(2, "First name must be at least 2 characters long."),
    maxLength(50, "First name must be at most 50 characters long.")
);
