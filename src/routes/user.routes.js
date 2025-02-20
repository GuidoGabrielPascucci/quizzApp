import { Router } from "express";
import { login, signup } from "../controllers/user.controller.js";
import { validateLoginFieldsMw, sanitizeLoginMw } from "../middlewares/loginMw.js";
import { validateSignupFieldsMw, sanitizeSignupMw } from "../middlewares/signupMw.js";

export const userRouter = Router();
userRouter.post("/signup",  validateSignupFieldsMw, sanitizeSignupMw, signup);
userRouter.post("/login", validateLoginFieldsMw, sanitizeLoginMw, login);