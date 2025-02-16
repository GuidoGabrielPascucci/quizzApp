import { object, pipe, string, nonEmpty, minLength, maxLength } from "valibot";
import { emailSchema, passwordSchema } from "./emailPasswordSchema.js";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "./user.schema.helper.js";
import { getLengthSchemaObj } from "./user.schema.helper.js";

const firstnameStr = 'First name';
const firstNameMinLengthSchemaObj = getLengthSchemaObj(firstnameStr, NAME_MIN_LENGTH, true);
const firstNameMaxLengthSchemaObj = getLengthSchemaObj(firstnameStr, NAME_MAX_LENGTH, false);

const unObjetoFirstName = getSchemaObject(firstnameStr, {
    length: firstNameMinLengthSchemaObj.length,
    message: firstNameMinLengthSchemaObj.message
},
{
    length: firstNameMaxLengthSchemaObj.length,
    message: firstNameMaxLengthSchemaObj.message
});

const lastnameStr = 'Last name';
const lastNameMinLengthSchemaObj = getLengthSchemaObj(lastnameStr, NAME_MIN_LENGTH, true);
const lastNameMaxLengthSchemaObj = getLengthSchemaObj(lastnameStr, NAME_MAX_LENGTH, false);

const unObjetoLastName = getSchemaObject(lastnameStr, {
    length: lastNameMinLengthSchemaObj.length,
    message: lastNameMaxLengthSchemaObj.message
},
{
    length: lastNameMaxLengthSchemaObj.length,
    message: lastNameMaxLengthSchemaObj.message
});

const usernameStr = 'Username';
const usernameMinLengthSchemaObj = getLengthSchemaObj(usernameStr, USERNAME_MIN_LENGTH, true);
const usernameMaxLengthSchemaObj = getLengthSchemaObj(usernameStr, USERNAME_MAX_LENGTH, false);

const unObjetoUsername = getSchemaObject(usernameStr,
    {
        length: usernameMinLengthSchemaObj.length,
        message: usernameMinLengthSchemaObj.message
    },
    {
        length: usernameMaxLengthSchemaObj.length,
        message: usernameMaxLengthSchemaObj.message
    }
);

const misObjetosArray = [
    unObjetoFirstName,
    unObjetoLastName,
    unObjetoUsername
];

const getSchemaObject = (field, minLengthObj, maxLengthObj) => {
    return {
        field,
        minLengthObj,
        maxLengthObj
    }
};

const schemas = [];

for (const obj of misObjetosArray) {
    const schema = getStringFieldSchema(obj.field, obj.minLengthObj, obj.maxLengthObj);
    schemas.push(schema);
}

function getStringFieldSchema(field, minLengthObj, maxLengthObj) {
    return pipe(
        string(),
        nonEmpty(`${field} is required, can not be empty.`),
        minLength(minLengthObj.length, minLengthObj.message),
        maxLength(maxLengthObj.length, maxLengthObj.message)
    );
}

export const signupSchema = object({
    firstName: schemas[0],
    lastName: schemas[1],
    username: schemas[2],
    email: emailSchema,
    password: passwordSchema,
});