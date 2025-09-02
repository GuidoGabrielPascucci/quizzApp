import { pipe, string, nonEmpty, minLength, maxLength, custom } from "valibot";
import { usernameMessages, usernameLimits } from "./username.constants.js";

export const usernameSchema = pipe(
    string(),
    nonEmpty(usernameMessages.emptyField),
    minLength(usernameLimits.min, usernameMessages.tooShort),
    maxLength(usernameLimits.max, usernameMessages.tooLong),
    custom<string>(
        (val) => /^[a-zA-Z0-9_.]+$/.test(val as string),
        usernameMessages.invalidFormat
    )
);
