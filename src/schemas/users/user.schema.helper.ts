export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const USERNAME_MIN_LENGTH = 6;
export const USERNAME_MAX_LENGTH = 20;

export function getLengthSchemaObj(
    field: string,
    length: number,
    isMinLength: boolean
) {
    let errorMessage = `Your ${field} is too`;

    errorMessage = isMinLength
        ? `${errorMessage} short`
        : `${errorMessage} long`;

    return {
        length,
        message: errorMessage,
    };
}
