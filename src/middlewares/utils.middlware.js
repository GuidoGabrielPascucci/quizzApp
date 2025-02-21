const mustEnterBothFieldsToMessage = 'You must enter both fields to';
export const mustEnterBothFieldsToLoginMessage = `${mustEnterBothFieldsToMessage} login.`
export const mustEnterBothFieldsToSignupMessage = `${mustEnterBothFieldsToMessage} signup.`
export const invalidRequestFormatMessage = 'Invalid request format. Expected application/json.';

export function validateRequestFormatMw(req, res, next) {
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({
            success: false,
            message: invalidRequestFormatMessage
        });
    }
    next();
}
