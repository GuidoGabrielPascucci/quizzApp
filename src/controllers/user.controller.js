import { UserService } from "../services/user.service.js"

const userService = new UserService();

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const accessToken = await userService.login(email, password);
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
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
        const newUserDTO = await userService.signup(user)
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