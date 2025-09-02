import { pipe, string, nonEmpty, minLength, maxLength } from "valibot";
import { lastnameMessages, lastnameLimits } from "./lastname.constants.js";
import { firstnameLimits } from "../firstname/firstname.constants.js";

export const lastnameSchema = pipe(
    string(),
    nonEmpty(lastnameMessages.emptyField),
    minLength(firstnameLimits.min, lastnameMessages.tooShort),
    maxLength(firstnameLimits.max, lastnameMessages.tooLong)
);
