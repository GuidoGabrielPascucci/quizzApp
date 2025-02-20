import jwt from "jsonwebtoken";

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

export function signToken(user) {
    const payload = {
        userId: user._id,
        userEmail: user.email
    };
    const options = {
        expiresIn: "1h"
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
}