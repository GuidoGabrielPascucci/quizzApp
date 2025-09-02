import { strictObject } from "valibot";
import { passwordSchema } from "./password/password.schema.js";
import { emailSchema } from "./email/email.schema.js";

const loginSchemaObject = {
    email: emailSchema,
    password: passwordSchema,
};

// export const unexpectedFieldsMessage =
//     "Invalid request: unexpected fields provided.";

export const unexpectedFieldsMessage =
    "Password must include uppercase, lowercase, number and symbol.";

export const loginSchema = strictObject(
    loginSchemaObject,
    unexpectedFieldsMessage
);
