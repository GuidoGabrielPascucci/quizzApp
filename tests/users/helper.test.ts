// import { doRequest } from "./user.test.helper.js";
// import "jest";

// describe("Helper Unit Tests", () => {
//     test("Debe poder hacer una petición post", async () => {
//         const url = "/users/login";

//         const res = await doRequest(
//             url,
//             { email: "sfs", password: "sfsf" },
//             "application/json",
//             "POST"
//         );

//         jest.fn().

//         expect(res.status).toBe(200);
//         expect(res.body).toMatchObject({
//             success: true,
//             message: "Login successful",
//         });
//     });
// });

import express from "express";
import { doRequest } from "./user.test.helper.js";

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
    res.json({ message: "GET ok" });
});

app.post("/test", (req, res) => {
    res.json({ message: "POST ok", data: req.body });
});

describe("doRequest (con Supertest)", () => {
    it("debería realizar una petición GET correctamente", async () => {
        const result = await doRequest("/test", "GET");

        expect(result.body).toEqual({ message: "GET ok" });
    });

    it("debería realizar una petición POST correctamente", async () => {
        const payload = { name: "Guido" };

        const result = await doRequest(
            "/test",
            "POST",
            payload,
            "application/json"
        );

        expect(result.body).toEqual({ message: "POST ok", data: payload });
    });
});
