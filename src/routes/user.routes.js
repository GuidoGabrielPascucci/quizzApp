import { Router } from "express";
import { validateLoginFieldsMw, sanitizeLoginMw } from "../middlewares/login.middleware.js";
import { validateSignupFieldsMw, sanitizeSignupMw } from "../middlewares/signup.middleware.js";
import { validateRequestFormatMw } from "../middlewares/utils.middlware.js";

export class UserRoutes {
    
    constructor(userController) {
        this.userController = userController;
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes = () => {
        this.setLoginRoute();
        this.setSignupRoute();
    }

    setLoginRoute = () => {
        const endpoint = '/login';
        const loginMiddlewares = [
            validateRequestFormatMw,
            validateLoginFieldsMw,
            sanitizeLoginMw
        ];
        this.router.post(endpoint, ...loginMiddlewares, this.userController.login);
    }

    setSignupRoute = () => {
        const endpoint = '/signup';
        const signupMiddlewares = [
            validateRequestFormatMw,
            validateSignupFieldsMw,
            sanitizeSignupMw
        ];
        this.router.post(endpoint, ...signupMiddlewares, this.userController.signup);
    }

    initAppRouter = (app) => {
        app.use('/users', this.router);
    }
    
}
