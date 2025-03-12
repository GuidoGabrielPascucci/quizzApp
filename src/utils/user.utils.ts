import jwt from "jsonwebtoken";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export function sanitizeUserForResponse(createdUser: any) {
    const createdUserPlainObj = createdUser.toObject();
    delete createdUserPlainObj.password;
    delete createdUserPlainObj.__v;
    return createdUserPlainObj;
}

export function getSignupData(req: any) {
    return {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };
}

export function signToken(user: any): string {
    const payload = {
        userId: user._id,
        userEmail: user.email,
    };
    const options = {
        expiresIn: 3600,
    };
    return jwt.sign(payload, JWT_SECRET_KEY, options);
}
