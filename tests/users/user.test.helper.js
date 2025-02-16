import request from "supertest";
import { app } from "../../server.js";

export const loginRequest = async (loginUrl, data, contentType) => {
    let requestSetup = request(app).post(loginUrl);
    if (contentType)
        requestSetup.set('Content-Type', contentType);
    return await requestSetup.send(data);
}

export const signupRequest = async (signupUrl, data, contentType) => {
    return await request(app).post(signupUrl).send(data);
}