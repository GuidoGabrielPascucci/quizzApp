import { object } from "valibot";
import {
    firstnameSchema,
    lastnameSchema,
    usernameSchema,
    emailSchema,
    passwordSchema,
} from "./index.js";

export const signupSchema = object({
    firstname: firstnameSchema,
    lastname: lastnameSchema,
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

export const userAlreadyExistsMessage = "User already exists. Please log in";
