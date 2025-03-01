import { pipe, string, nonEmpty, minLength, maxLength } from "valibot";

const pw_minLength = 6;
const pw_maxLength = 18;
const pw_nonEmptyMessage = 'Please enter your password.';
const pw_minLengthMessage = 'Password must have 6 characters at least.';
const pw_maxLengthMessage = 'Password is too long.';

export const passwordSchema = pipe(
    string(),
    nonEmpty(pw_nonEmptyMessage),
    minLength(pw_minLength, pw_minLengthMessage),
    maxLength(pw_maxLength, pw_maxLengthMessage)
);

export const passwordRelatedData = {
    minLength: pw_minLength,
    maxLength: pw_maxLength,
    nonEmptyMessage: pw_nonEmptyMessage,
    minLengthMessage: pw_minLengthMessage,
    maxLengthMessage: pw_maxLengthMessage
}