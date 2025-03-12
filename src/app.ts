import express from "express";
import { config } from "dotenv";
import { UserRoutes } from "./routes/user.routes.js";
import UserController from "./controllers/user.controller.js";
import UserService from "./services/user.service.js";
import QuizzService from "./services/quizz.service.js";
import QuizzController from "./controllers/quizz.controller.js";
import QuizzRoutes from "./routes/quizz.routes.js";
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
