import express from "express";
import { config } from "dotenv";
import { UserRoutes } from "./src/routes/user.routes.js";
import { UserController } from "./src/controllers/user.controller.js";
import { UserService } from "./src/services/user.service.js";
import QuizzService from "./src/services/quizz.service.js";
import QuizzController from "./src/controllers/quizz.controller.js";
import QuizzRoutes from "./src/routes/quizz.routes.js";
import cors from "cors";

config();
const app = express();
app.use(express.json());
app.use(cors());

// User
const userService = new UserService();
const userController = new UserController(userService);
const userRoutes = new UserRoutes(userController);
userRoutes.initAppRouter(app);

// Quizz
const quizzService = new QuizzService();
const quizzController = new QuizzController(quizzService);
const quizzRoutes = new QuizzRoutes(quizzController);
quizzRoutes.initAppRouter(app);

export default app;
