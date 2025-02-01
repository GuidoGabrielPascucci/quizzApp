import { object, pipe, string, nonEmpty, minLength, maxLength } from "valibot";
import { emailSchema, passwordSchema } from "./emailPasswordSchema.js";

function getNameSchema(field, minLengthMessage, maxLengthMessage) {
    return pipe(
        string(),
        nonEmpty(`${field} is required, can not be empty.`),
        minLength(2, minLengthMessage),
        maxLength(50, maxLengthMessage)
    );
}

const firstNameSchema = getNameSchema('First name', 'Your first name is too short.', 'Your first name is too long.');
const lastNameSchema = getNameSchema('Last name', 'Your last name is too short.', 'Your last name is too long.');

export const signupSchema = object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
});