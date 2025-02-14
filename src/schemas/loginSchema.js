import { strictObject } from "valibot";
import { emailSchema, passwordSchema } from "./emailPasswordSchema.js";

const loginSchemaObject = {
    email: emailSchema,
    password: passwordSchema
};

export const unexpectedFieldsMessage = "Invalid request: unexpected fields provided.";
export const loginSchema = strictObject(loginSchemaObject, unexpectedFieldsMessage);