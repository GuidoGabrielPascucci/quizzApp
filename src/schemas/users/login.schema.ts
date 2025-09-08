import { strictObject } from "valibot";
import { passwordSchema } from "./password/password.schema.js";
import { emailSchema } from "./email/email.schema.js";

const loginSchemaObject = {
    email: emailSchema,
    password: passwordSchema,
};

export const unexpectedFieldsMessage = "Unexpected fields in login payload";
export const invalidCredentialsMessage = "Invalid credentials";

export const loginSchema = strictObject(
    loginSchemaObject,
    unexpectedFieldsMessage
);

// export const unexpectedFieldsMessage2 =
//     "Password must include uppercase, lowercase, number and symbol.";
