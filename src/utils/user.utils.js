export function sanitizeUserForResponse(createdUser) {
    const createdUserPlainObj = createdUser.toObject();
    delete createdUserPlainObj.password;
    delete createdUserPlainObj.__v;
    return createdUserPlainObj;
}

export function getSignupData(req) {
    return {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
}