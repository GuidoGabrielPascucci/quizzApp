import { Router, Express } from "express";
import UserController from "../controllers/user.controller.js";
import { validateRequestFormatMw } from "../middlewares/utils.middleware.js";
import {
    validateLoginFieldsMw,
    validateSignupFieldsMw,
    sanitizeLoginMw,
    sanitizeSignupMw,
} from "../middlewares/user.middleware.js";

export class UserRoutes {
    userController: UserController;
    router: Router;

    constructor(userController: UserController) {
        this.userController = userController;
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes = () => {
        this.setLoginRoute();
        this.setSignupRoute();
    };

    setLoginRoute = () => {
        const endpoint = "/login";
        const loginMiddlewares = [
            validateRequestFormatMw,
            validateLoginFieldsMw,
            sanitizeLoginMw,
        ];
        this.router.post(
            endpoint,
            ...loginMiddlewares,
            this.userController.login
        );
    };

    setSignupRoute = () => {
        const endpoint = "/signup";
        const signupMiddlewares = [
            validateRequestFormatMw,
            validateSignupFieldsMw,
            sanitizeSignupMw,
        ];
        this.router.post(
            endpoint,
            ...signupMiddlewares,
            this.userController.signup
        );
    };

    initAppRouter = (app: Express) => {
        app.use("/users", this.router);
    };
}
