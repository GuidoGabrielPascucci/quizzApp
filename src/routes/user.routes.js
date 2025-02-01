import { Router } from "express";

import { login, signup } from "../controllers/user.controller.js";
import { validateLoginFieldsMw, sanitizeLoginMw } from "../middlewares/loginMw.js";

export const userRouter = Router();
userRouter.post("/signup",  signup);
userRouter.post("/login", validateLoginFieldsMw, sanitizeLoginMw, login);