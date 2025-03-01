import { strictObject } from "valibot";
import { passwordSchema } from "./users/password.schema.js";
import { emailSchema } from "./users/email.schema.js";

const loginSchemaObject = {
    email: emailSchema,
    password: passwordSchema
};

export const unexpectedFieldsMessage = "Invalid request: unexpected fields provided.";
export const loginSchema = strictObject(loginSchemaObject, unexpectedFieldsMessage);