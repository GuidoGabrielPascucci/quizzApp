import { getLengthSchemaObj, NAME_MIN_LENGTH, NAME_MAX_LENGTH } from "../user.schema.helper.js";
import { getSchemaObject } from "./signup/signup.schema.helper.js";

const fieldStringName = 'Last name';
const lastNameMinLengthSchemaObj = getLengthSchemaObj(fieldStringName, NAME_MIN_LENGTH, true);
const lastNameMaxLengthSchemaObj = getLengthSchemaObj(fieldStringName, NAME_MAX_LENGTH, false);

const minLengthObj_lastName = {
    length: lastNameMinLengthSchemaObj.length,
    message: lastNameMaxLengthSchemaObj.message
};

const maxLengthObj_lastName = {
    length: lastNameMaxLengthSchemaObj.length,
    message: lastNameMaxLengthSchemaObj.message
}

export const unObjetoLastName = getSchemaObject(fieldStringName, minLengthObj_lastName, maxLengthObj_lastName);
