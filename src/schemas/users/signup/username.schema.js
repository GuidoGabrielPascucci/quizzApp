import { getLengthSchemaObj, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from "../../user.schema.helper.js";
import { getSchemaObject } from "./signup.schema.helper.js";

const fieldStringName = 'Username';
const usernameMinLengthSchemaObj = getLengthSchemaObj(fieldStringName, USERNAME_MIN_LENGTH, true);
const usernameMaxLengthSchemaObj = getLengthSchemaObj(fieldStringName, USERNAME_MAX_LENGTH, false);

const minLengthObj_username = {
    length: usernameMinLengthSchemaObj.length,
    message: usernameMinLengthSchemaObj.message
}

const maxLengthObj_username = {
    length: usernameMaxLengthSchemaObj.length,
    message: usernameMaxLengthSchemaObj.message
}

export const unObjetoUsername = getSchemaObject(fieldStringName, minLengthObj_username, maxLengthObj_username);
