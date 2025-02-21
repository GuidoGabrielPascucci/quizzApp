import request from "supertest";
import { app } from "../../server.js";

export const doRequest = async (url, data, contentType) => {
    let requestSetup = request(app).post(url);
    if (contentType) {
        requestSetup.set('Content-Type', contentType);
    }
    return await requestSetup.send(data);
}
