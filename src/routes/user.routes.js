import { Router } from "express";
import { validateLoginFieldsMw, sanitizeLoginMw } from "../middlewares/loginMw.js";
import { validateSignupFieldsMw, sanitizeSignupMw } from "../middlewares/signupMw.js";
import { validateRequestFormatMw } from "../middlewares/utils.middlware.js";

export class UserRoutes {
    
    userRouter = Router();
    
    constructor(userController) {
        this.userController = userController;
    }

    login() {
        const endpoint = '/login';
        const loginMiddlewares = [
            validateRequestFormatMw,
            validateLoginFieldsMw,
            sanitizeLoginMw
        ];
        this.userRouter.post(endpoint, ...loginMiddlewares, this.userController.login);
    }

    signup() {
        const endpoint = '/signup';
        const signupMiddlewares = [
            validateRequestFormatMw,
            validateSignupFieldsMw,
            sanitizeSignupMw
        ];
        this.userRouter.post(endpoint, ...signupMiddlewares, this.userController.signup);
    }

}
