import { pipe, string, nonEmpty, email, minLength, maxLength } from "valibot";
import { emailMessages, emailLimits } from "./email.constants.js";

export const emailSchema = pipe(
    string(emailMessages.notString),
    nonEmpty(emailMessages.emptyField),
    email(emailMessages.badFormat),
    minLength(emailLimits.min, emailMessages.tooShort),
    maxLength(emailLimits.max, emailMessages.tooLong)
);
