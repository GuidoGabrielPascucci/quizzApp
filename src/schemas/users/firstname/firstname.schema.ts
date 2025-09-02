import { pipe, string, nonEmpty, minLength, maxLength } from "valibot";
import { firstnameMessages, firstnameLimits } from "./firstname.constants.js";

export const firstnameSchema = pipe(
    string(),
    nonEmpty(firstnameMessages.emptyField),
    minLength(firstnameLimits.min, firstnameMessages.tooShort),
    maxLength(firstnameLimits.max, firstnameMessages.tooLong)
);
