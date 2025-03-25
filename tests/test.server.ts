import express from "express";
import supertest from "supertest";
import UserController from "../src/controllers/user.controller.js";

export function testServer<T extends new (...args: any[]) => any>(
    RoutesClass: T,
    controllerInstance: UserController
) {
    const app = express();
    app.use(express.json());
    const routesInstance = new RoutesClass(controllerInstance);
    routesInstance.initAppRouter(app);
    return supertest(app);
}
