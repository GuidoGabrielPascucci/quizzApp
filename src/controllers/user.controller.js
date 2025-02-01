import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { config } from "dotenv";

import { userSchema } from "../schemas/userSchema.js";

config();
const User = mongoose.model("User", userSchema);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "There's no such an email" });
        }
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }
        const accessToken = jwt.sign({...user}, JWT_SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({
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
        res
            .status(201)
            .json({
                message: "User registered successfully",
                user: createdUser
            });
    } catch (err) {
        res
            .status(500)
            .json({
                message: "An error may have occured"
            });
        console.error(err);
    }
}