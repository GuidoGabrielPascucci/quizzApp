import { Router, Express } from "express";
import UserController from "@controllers/user.controller.js";
//#region MIDDLEWARES
import {
    sanitizeLoginMw,
    validateLoginFieldsMw,
} from "@middlewares/users/login.middleware.js";
import {
    sanitizeSignupMw,
    validateSignupFieldsMw,
    validateUpdateStatsInputs,
} from "@middlewares/users/signup.middleware.js";
import { validateRequestFormatMw } from "@middlewares/utils.middleware.js";
//#endregion

import { readFileSync } from "node:fs";

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
        this.setQuickStart(); // SOLO PARA DESARROLLO
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

    // SOLO PARA DESARROLLO
    setQuickStart = () => {
        const endpoint = "/quick-start";
        this.router.get(endpoint, (_, res) => {
            const path = "./dev/mocks/users/mock.json";
            const jsonStr = readFileSync(path, { encoding: "utf-8" });
            const users = JSON.parse(jsonStr);
            const n = users.length;
            const i = Math.floor(Math.random() * n);
            res.json(users[i]);
        });
    };

    initAppRouter = (app: Express) => {
        app.use("/users", this.router);
    };
}

export default UserRoutes;
