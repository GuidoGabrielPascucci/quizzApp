import UserService from "../services/user.service.js";
import { Request, Response } from "express";
import { UserSignupData, UserStatsNewData } from "../types/user.types.js";

import { readFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

class UserController {
    userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    login = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body;
            const accessToken = await this.userService.login(email, password);
            if (!accessToken) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            const user = await this.userService.findByEmail(email);
            let userResponse = {};
            if (user) {
                userResponse = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    avatar: user.avatar,
                    stats: user.stats,
                };
            }
            res.status(200).json({
                success: true,
                message: "You are logged!",
                accessToken,
                user: userResponse,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "An error may have occurred" });
        }
    };

    signup = async (req: Request, res: Response): Promise<any> => {
        try {
            const user = req.body as UserSignupData;
            const userExist = await this.userService.findByEmail(user.email);
            if (userExist) {
                return res.status(409).json({
                    success: false,
                    message: "You are already signed up! Go to login.",
                });
            }
            const newUserDTO = await this.userService.signup(user);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: newUserDTO,
            });
        } catch (err) {
            console.error("server error: ", err);
            return res.status(500).json({
                message: "An error may have occured",
            });
        }
    };

    updateStats = async (req: Request, res: Response): Promise<any> => {
        try {
            const stats: UserStatsNewData = req.body;

            await this.userService.updateStats(stats);

            return res.status(200).json({
                success: true,
                message: "Stats actualizados",
            });
        } catch (e) {
            console.log(e);

            return res.status(500).json({
                success: false,
                message: "Error interno. No se pudo completar la operación",
            });
        }
    };

    quickStart = async (req: Request, res: Response): Promise<any> => {
        // ESTO EN ECMASCRIPT MODULES NO FUNCIONA!!!! SOLO PARA COMMON JS
        // console.log(__dirname);

        // const __filename = fileURLToPath(import.meta.url);
        // const __dirname = path.dirname(__filename);
        // console.log(__dirname);

        const path = "./dist/src/dev/seed/json/users-mocked.json";
        const jsonStr = readFileSync(path, { encoding: "utf-8" });
        const users = JSON.parse(jsonStr);
        const n = users.length;
        const i = Math.floor(Math.random() * n);
        res.json(users[i]);
    };
}

export default UserController;
