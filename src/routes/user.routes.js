import { Router } from "express";
import { login, signup } from "../controllers/user.controller.js";
import { validateLoginFieldsMw, sanitizeLoginMw } from "../middlewares/loginMw.js";
import { validateSignupFieldsMw, sanitizeSignupMw } from "../middlewares/signupMw.js";
import { validateRequestFormatMw } from "../middlewares/utils.middlware.js";

export const userRouter = Router();
userRouter.post('/signup',  validateRequestFormatMw, validateSignupFieldsMw, sanitizeSignupMw, signup);
userRouter.post('/login', validateRequestFormatMw, validateLoginFieldsMw, sanitizeLoginMw, login);