import { Request, Response } from "express";
import UserService from "@services/user.service.js";
import { UserSignupData, UserStatsNewData } from "@_types/user.types.js";
import { ConflictError, UnauthorizedError } from "@errors";

class UserController {
    userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            const { accessToken, user } = await this.userService.login(
                email,
                password
            );

            res.status(200).json({
                success: true,
                message: "You are logged!",
                accessToken,
                user,
            });
        } catch (err) {
            if (err instanceof UnauthorizedError) {
                res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                });
                return;
            } else {
                res.status(500).json({ message: "An error may have occurred" });
            }
        }
    };

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const newUser = req.body as UserSignupData;
            const { accessToken, user } = await this.userService.signup(
                newUser
            );

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                accessToken,
                user,
            });
        } catch (err) {
            if (err instanceof ConflictError) {
                res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                });
            } else {
                res.status(500).json({
                    message: "An error may have occured",
                });
            }
        }
    };

    updateStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const stats: UserStatsNewData = req.body;

            await this.userService.updateStats(stats);

            res.status(200).json({
                success: true,
                message: "Stats actualizados",
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Error interno. No se pudo completar la operación",
            });
        }
    };
}

export default UserController;
