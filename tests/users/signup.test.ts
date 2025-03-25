import mongoose from "mongoose";
import { config } from "dotenv";
import User from "../../src/models/user.model.js";
import { doRequest } from "./user.test.helper.js";
import {
    invalidRequestFormatMessage,
    msg_mustEnterAllFieldsToSignup,
} from "../../src/middlewares/utils.middleware.js";

import { emailRelatedData } from "../../src/schemas/users/email.schema.js";

config();
const MONGO_URI = process.env.MONGO_URI ?? "";

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe.skip("POST users/signup", () => {
    const signupUrl = "/users/signup";

    describe("Caso de éxito, usuario registrado", () => {
        test("Debería registrar un usuario correctamente", async () => {
            // Arrange
            const expectedStatus = 201;

            const expectedMatchObject = {
                success: true,
                message: "User registered successfully",
                user: {
                    _id: expect.any(String),
                    firstname: expect.any(String),
                    lastname: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                    score: expect.any(Number),
                    createdAt: expect.any(String),
                },
            };

            const data = {
                firstname: "Guido",
                lastname: "Pascucci",
                username: "gp4s444",
                email: "g.g.pascucci@gmail.com",
                password: "p4sk1234",
            };

            // Act
            const res = await doRequest(signupUrl, data);

            // Assert
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toMatchObject(expectedMatchObject);
        });
    });

    describe("Petición mal enviada", () => {
        test("Debería fallar si no se envía el body", async () => {
            // Arrange
            const expectedStatus = 400;
            const expectedMatchObject = {
                success: false,
                message: msg_mustEnterAllFieldsToSignup,
            };
            const data = {};

            // Act
            const res = await doRequest(signupUrl, data);

            // Assert
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toMatchObject(expectedMatchObject);
        });

        test("Deberia fallar si se envía como algo distinto de application/json", async () => {
            const data = "email=g.g.pascucci@gmail.com&password=p4sk1234";
            const contentType = "text/plain";
            const res = await doRequest(signupUrl, data, contentType);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: invalidRequestFormatMessage,
            });
        });
    });

    describe("Validación de campos obligatorios", () => {
        test("Debería devolver 400 si falta el username", async () => {
            // arrange
            const expectedStatus = 400;
            const expectedMatchObject = {
                success: false,
                message: msg_mustEnterAllFieldsToSignup,
            };

            const data = {
                firstname: "Abcdef",
                lastname: "egeagsf",
                email: "test@example.com",
                password: "SecurePass123!",
            };

            // act
            const res = await doRequest(signupUrl, data);

            // assert
            //console.log(res.body);
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toMatchObject(expectedMatchObject);

            //expect(res.body.error).toMatch(/username es requerido/i);
        });
    });

    describe("Formato de datos inválidos", () => {
        test("Debería fallar si el email es inválido", async () => {
            // arrange
            const expectedStatus = 400;

            const expectedMatchObject = {
                success: false,
                message: emailRelatedData.badFormatMessage,
            };

            const data = {
                firstname: "julian",
                lastname: "alvarez",
                username: "juliUs5",
                email: "invalid-email",
                password: "SecurePass123!",
            };

            // act
            const res = await doRequest(signupUrl, data);

            // assert
            console.log(res.body);

            expect(res.status).toBe(expectedStatus);
            expect(res.body).toEqual(expectedMatchObject);

            //expect(res.body.error).toMatch(/email inválido/i);
        });
    });

    describe("Usuario ya registrado", () => {
        test("Debería fallar si el usuario ya está registrado", async () => {
            // ARRANGE
            const expectedStatus = 409;
            const expectedMatchObject = {
                success: false,
                message: "You are already signed up! Go to login.",
            };

            const data = {
                firstname: "Lionel",
                lastname: "Messi",
                username: "lionel10",
                email: "liomessi10@ejemplo.ar",
                password: "antoteamo12",
            };
            // Primero registrar el usuario
            await doRequest(signupUrl, data);

            // ACT
            // Intentar registrarlo de nuevo
            const res = await doRequest(signupUrl, data);

            // ASSERT
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toEqual(expectedMatchObject);
            //expect(res.body.error).toMatch(/usuario ya registrado/i);
        });
    });

    describe("Inyección SQL y ataques XSS", () => {
        test.only("Debería rechazar intentos de inyección SQL", async () => {
            // ARRANGE
            const expectedStatus = 400;
            const expectedMatchObject = {
                success: false,
                message: "",
            };

            const data = {
                username: "' OR 1=1; --",
                email: "sql@example.com",
                password: "SecurePass123!",
                firstname: "Alan",
                lastname: "Paul",
            };

            // ACT
            const res = await doRequest(signupUrl, data);

            // ASSERT
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toEqual(expectedMatchObject);
        });

        test("Debería rechazar intentos de XSS", async () => {
            const res = await doRequest("/signup", {
                username: "<script>alert('xss')</script>",
                email: "xss@example.com",
                password: "SecurePass123!",
            });

            expect(res.status).toBe(400);
        });
    });

    describe("Datos persistidos correctamente", () => {
        test("Debería guardar el usuario en la base de datos", async () => {
            await doRequest("/signup", {
                username: "databaseUser",
                email: "dbuser@example.com",
                password: "SecurePass123!",
            });

            const user = await User.findOne({ email: "dbuser@example.com" });
            expect(user).not.toBeNull();
            expect(user?.username).toBe("databaseUser");
        });
    });
});
