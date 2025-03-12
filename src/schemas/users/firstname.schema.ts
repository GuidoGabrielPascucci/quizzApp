import {
    getLengthSchemaObj,
    NAME_MIN_LENGTH,
    NAME_MAX_LENGTH,
} from "../user.schema.helper.js";
import { getSchemaObject } from "./signup/signup.schema.helper.js";

const fieldStringName = "First name";
const firstNameMinLengthSchemaObj = getLengthSchemaObj(
    fieldStringName,
    NAME_MIN_LENGTH,
    true
);
const firstNameMaxLengthSchemaObj = getLengthSchemaObj(
    fieldStringName,
    NAME_MAX_LENGTH,
    false
);

const minLengthObj_firstName = {
    length: firstNameMinLengthSchemaObj.length,
    message: firstNameMinLengthSchemaObj.message,
};

const maxLengthObj_firstName = {
    length: firstNameMaxLengthSchemaObj.length,
    message: firstNameMaxLengthSchemaObj.message,
};

export const unObjetoFirstName = getSchemaObject(
    fieldStringName,
    minLengthObj_firstName,
    maxLengthObj_firstName
);
