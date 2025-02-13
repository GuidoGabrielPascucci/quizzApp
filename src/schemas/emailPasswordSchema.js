import { pipe, string, nonEmpty, email, minLength, maxLength } from "valibot";

const emailMinLength = 6;
const emailMaxLength = 254;
const emailNonEmptyMessage = 'Please enter your email.';
const emailEmailMessage = 'The email is badly formatted.';
const emailMaxLengthMessage = 'Your email is too long.';

export const emailSchema = pipe(
    string(),
    nonEmpty(emailNonEmptyMessage),
    email(emailEmailMessage),
    maxLength(254, emailMaxLengthMessage)
);

export const emailRelatedData = {
    minLength: emailMinLength,
    maxLength: emailMaxLength,
    nonEmptyMessage: emailNonEmptyMessage,
    emailMessage: emailEmailMessage,
    maxLengthMessage: emailMaxLengthMessage
}

const passwordMinLength = 6;
const passwordMaxLength = 18;
const passwordNonEmptyMessage = 'Please enter your password.';
const passwordMinLengthMessage = 'Password must have 6 characters at least.';
const passwordMaxLengthMessage = 'Password is too long.';

export const passwordSchema = pipe(
    string(),
    nonEmpty(passwordNonEmptyMessage),
    minLength(passwordMinLength, passwordMinLengthMessage),
    maxLength(passwordMaxLength, passwordMaxLengthMessage)
);

export const passwordRelatedData = {
    minLength: passwordMinLength,
    maxLength: passwordMaxLength,
    nonEmptyMessage: passwordNonEmptyMessage,
    minLengthMessage: passwordMinLengthMessage,
    maxLengthMessage: passwordMaxLengthMessage
}