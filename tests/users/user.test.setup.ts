import UserService from "../../src/services/user.service.js";
import UserController from "../../src/controllers/user.controller.js";
import UserRoutes from "../../src/routes/user.routes.js";
import { testServer } from "../test.server.js";

export const userService = new UserService();
const userController = new UserController(userService);
export const request = testServer(UserRoutes, userController);
