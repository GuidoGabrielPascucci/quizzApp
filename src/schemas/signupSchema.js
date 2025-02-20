import { object, pipe, string, nonEmpty, minLength, maxLength } from "valibot";
import { emailSchema, passwordSchema } from "./emailPasswordSchema.js";
import { unObjetoFirstName } from "./users/signup/firstname.schema.js";
import { unObjetoLastName } from "./users/signup/lastname.schema.js";
import { unObjetoUsername } from "./users/signup/username.schema.js";

const getStringFieldSchema = (field, minLengthObj, maxLengthObj) => {
    return pipe(
        string(),
        nonEmpty(`${field} is required, can not be empty.`),
        minLength(minLengthObj.length, minLengthObj.message),
        maxLength(maxLengthObj.length, maxLengthObj.message)
    );
}

const misObjetosArray = [
    unObjetoFirstName,
    unObjetoLastName,
    unObjetoUsername
];

const schemas = [];

for (const obj of misObjetosArray) {
    const schema = getStringFieldSchema(obj.field, obj.minLengthObj, obj.maxLengthObj);
    schemas.push(schema);
}

export const signupSchema = object({
    firstname: schemas[0],
    lastname: schemas[1],
    username: schemas[2],
    email: emailSchema,
    password: passwordSchema,
});