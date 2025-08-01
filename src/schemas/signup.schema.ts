import { object } from "valibot";
import {
    firstnameSchema,
    lastnameSchema,
    usernameSchema,
    emailSchema,
    passwordSchema,
} from "./users/index.js";

export const signupSchema = object({
    firstname: firstnameSchema,
    lastname: lastnameSchema,
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});
