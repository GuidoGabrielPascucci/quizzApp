import { Router, Express } from "express";
import UserController from "../controllers/user.controller.js";
import { validateRequestFormatMw } from "../middlewares/utils.middleware.js";
import {
    validateLoginFieldsMw,
    validateSignupFieldsMw,
    sanitizeLoginMw,
    sanitizeSignupMw,
    validateUpdateStatsInputs,
} from "../middlewares/user.middleware.js";

class UserRoutes {
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
        this.setUpdateStatsRoute();
        this.setQuickStart();
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

    setUpdateStatsRoute = () => {
        const endpoint = "/update-stats";
        const middlewares = [validateUpdateStatsInputs];
        this.router.put(
            endpoint,
            ...middlewares,
            this.userController.updateStats
        );
    };

    setQuickStart = () => {
        const endpoint = "/quick-start";
        this.router.get(endpoint, this.userController.quickStart);
    };

    initAppRouter = (app: Express) => {
        app.use("/users", this.router);
    };
}

export default UserRoutes;
