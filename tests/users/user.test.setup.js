import { UserController } from "../../src/controllers/user.controller";
import { UserRoutes } from "../../src/routes/user.routes";
import { UserService } from "../../src/services/user.service";
import { testServer } from "../test.server";

export const userService = new UserService();
const userController = new UserController(userService);
export const request = testServer(UserRoutes, userController);