import { object } from "valibot";
import { emailSchema, passwordSchema } from "./emailPasswordSchema.js";

export const loginSchema = object({
    email: emailSchema,
    password: passwordSchema,
});