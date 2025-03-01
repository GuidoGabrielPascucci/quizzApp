import { pipe, string, nonEmpty, email, minLength, maxLength } from "valibot";

const minLengthValue = 5;
const maxLengthValue = 254;
const emptyFieldMessage = 'Please enter your email.';
const badFormatMessage = 'The email is badly formatted.';
const tooShortMessage = 'Your email is too short';
const tooLongMessage = 'Your email is too long.';

export const emailSchema = pipe(
    string(),
    nonEmpty(emptyFieldMessage),
    email(badFormatMessage),
    minLength(minLengthValue, tooShortMessage),
    maxLength(maxLengthValue, tooLongMessage)
);

export const emailRelatedData = {
    minLength: minLengthValue,
    maxLength: maxLengthValue,
    emptyFieldMessage,
    badFormatMessage,
    tooShortMessage,
    tooLongMessage
};