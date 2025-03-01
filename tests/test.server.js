import express from "express";
import supertest from "supertest";

export function testServer(RoutesClass, controllerInstance) {
    const app = express();
    app.use(express.json());
    const routesInstance = new RoutesClass(controllerInstance);
    routesInstance.initAppRouter(app);    
    return supertest(app);
}