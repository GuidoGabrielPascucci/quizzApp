import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { User } from "../models/user.model.js";
import { sanitizeUserForResponse } from "../utils/user.utils.js";

export async function login(req, res) {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user || !await compare(password, user.password)) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            {
                userId: user._id,
                userEmail: user.email
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            success: true,
            message: "You are logged!",
            accessToken
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error may have occurred" });
    }

}

export async function signup(req, res) {
    try {
        const user = req.body;
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
        const createdUser = await User.create(user);
        const newUserDTO = sanitizeUserForResponse(createdUser);
        return res
            .status(201)
            .json({
                success: true,
                message: "User registered successfully",
                user: newUserDTO
            });
    } catch (err) {
        console.error("server error: ", err);
        return res
            .status(500)
            .json({
                message: "An error may have occured"
            });
    }
}