export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const USERNAME_MIN_LENGTH = 6;
export const USERNAME_MAX_LENGTH = 20;

/*
export const FIRST_NAME_MIN_LENGTH_OBJECT = getNameMinLengthObject('First name');
export const FIRST_NAME_MAX_LENGTH_OBJECT = getNameMaxLengthObject('First name');
export const LAST_NAME_MIN_LENGTH_OBJECT = getNameMinLengthObject('Last name');
export const LAST_NAME_MAX_LENGTH_OBJECT = getNameMaxLengthObject('Last name');
export const USERNAME_MIN_LENGTH_OBJECT = getNameMinLengthObject('Username');
export const USERNAME_MAX_LENGTH_OBJECT = getNameMaxLengthObject('Username');
*/

export function getLengthSchemaObj(field, length, isMinLength) {
    const errorMessage = `Your ${field} is too`;
    errorMessage = isMinLength
    ? `${errorMessage} short`
    : `${errorMessage} long`;

    return {
        length,
        message: errorMessage
    };
}