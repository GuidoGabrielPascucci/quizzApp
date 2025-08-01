import mongoose from "mongoose";
import "dotenv/config";
import User from "../../src/models/user.model.js";
import { doRequest } from "./user.test.helper.js";
import {
    invalidRequestFormatMessage,
    msg_mustEnterAllFieldsToSignup,
} from "../../src/middlewares/utils.middleware.js";

import { emailRelatedData } from "../../src/schemas/users/email.schema.js";

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

describe("POST users/signup", () => {
    const signupUrl = "/users/signup";

    describe("Caso de éxito, usuario registrado", () => {
        test("Debería registrar un usuario correctamente", async () => {
            const expectedStatus = 201;

            const expectedObject = {
                success: true,
                message: "User registered successfully",
                accessToken: expect.any(String),
                user: {
                    id: expect.any(String),
                    firstname: expect.any(String),
                    lastname: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.any(String),
                    avatar: expect.any(String),
                    stats: {
                        totalScore: expect.any(Number),
                        totalCorrectAnswers: expect.any(Number),
                        totalAnswersGiven: expect.any(Number),
                        quizzesCompleted: expect.any(Number),
                        highestScore: expect.any(Number),
                        bestCategory: expect.any(String),
                        categoryScores: expect.any(Object),
                    },
                    quizHistory: expect.any(Array),
                },
            };

            const data = {
                firstname: "Guido",
                lastname: "Pascucci",
                username: "gp4s444",
                email: "g.g.pascucci@gmail.com",
                password: "p4sk1234",
            };

            const res = await doRequest(signupUrl, "POST", data);

            expect(res.status).toBe(expectedStatus);
            expect(res.body).toStrictEqual(expectedObject);
        });
        test("Debería guardar el usuario en la base de datos", async () => {
            const expectedStatus = 201;
            const expectedObject = {};
            const email = "john@lennon.com";
            const username = "johnlennon77";
            const data = {
                firstname: "John",
                lastname: "Lennon",
                username,
                email,
                password: "yokolovesu_!$",
            };
            const res = await doRequest(signupUrl, "POST", data);
            const user = await User.findOne({ email });
            expect(res.status).toBe(expectedStatus);
            expect(user).not.toBeNull();
            expect(user?.username).toBe(username);
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
            const res = await doRequest(signupUrl, "POST", data);

            // Assert
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toMatchObject(expectedMatchObject);
        });

        test("Deberia fallar si se envía como algo distinto de application/json", async () => {
            const data = "email=g.g.pascucci@gmail.com&password=p4sk1234";
            const contentType = "text/plain";
            const res = await doRequest(signupUrl, "POST", data, contentType);
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
            const res = await doRequest(signupUrl, "POST", data);

            // assert
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toMatchObject(expectedMatchObject);

            //expect(res.body.error).toMatch(/username es requerido/i);
        });
    });

    describe("Formato de datos inválidos", () => {
        test.only("Debería fallar si el email es inválido", async () => {
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
            const res = await doRequest(signupUrl, "POST", data);

            // assert
            console.log(res.body);

            expect(res.status).toBe(expectedStatus);
            expect(res.body).toEqual(expectedMatchObject);

            //expect(res.body.error).toMatch(/email inválido/i);
        });
    });

    describe("Usuario ya registrado", () => {
        test("Debería fallar si el usuario ya está registrado", async () => {
            const expectedStatus = 409;
            const expectedObject = {
                success: false,
                message: "User already exists. Please log in.",
                // message: "You are already signed up! Go to login.",
            };

            const data = {
                firstname: "Lionel",
                lastname: "Messi",
                username: "lionel10",
                email: "liomessi10@ejemplo.ar",
                password: "antoteamo12",
            };

            // Primero registrar el usuario
            await doRequest(signupUrl, "POST", data);

            // Intentar registrarlo de nuevo
            const res = await doRequest(signupUrl, "POST", data);

            expect(res.status).toBe(expectedStatus);
            expect(res.body).toStrictEqual(expectedObject);
            //expect(res.body.error).toMatch(/usuario ya registrado/i);
        });
    });

    describe("Inyección SQL y ataques XSS", () => {
        test("Debería rechazar intentos de inyección SQL", async () => {
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
            const res = await doRequest(signupUrl, "POST", data);

            // ASSERT
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toEqual(expectedMatchObject);
        });

        test("Debería rechazar intentos de XSS", async () => {
            const res = await doRequest("/signup", "POST", {
                username: "<script>alert('xss')</script>",
                email: "xss@example.com",
                password: "SecurePass123!",
            });

            expect(res.status).toBe(400);
        });

        test("Rechaza inyección NoSQL en el campo email", async () => {
            const res = await doRequest(signupUrl, "POST", {
                username: "testuser",
                email: { $ne: "" }, // <- intento de inyección
                password: "pass123",
                firstname: "Alan",
                lastname: "Paul",
            });

            console.log(res.body);

            expect(res.status).toBe(400); // o 422 según cómo manejes errores
        });
    });
});
