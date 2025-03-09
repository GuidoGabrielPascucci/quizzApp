import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "../../src/models/user.model.js";
import { userService } from "./user.test.setup.js";
import { doRequest } from "./user.test.helper.js";
import {
    invalidRequestFormatMessage,
    msg_mustEnterAllFieldsToLogin,
} from "../../src/middlewares/utils.middlware.js";
import { unexpectedFieldsMessage } from "../../src/schemas/login.schema.js";
import { emailRelatedData } from "../../src/schemas/users/email.schema.js";

config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST users/login", () => {
    const loginUrl = "/users/login";
    const validEmail = "a_valid_email@example.com";
    const validPassword = "a-valid-password";

    describe("Petición mal enviada", () => {
        test("Debe devolver 400 si el 'Content-Type' no es 'application/json'", async () => {
            const data = "email=elyssa50@hotmail.com&password=rory_09";
            const contentType = "text/plain";
            const res = await doRequest(loginUrl, data, contentType);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: invalidRequestFormatMessage,
            });
        });
        test("Debe devolver 400 si se envía un objeto vacío en el cuerpo de la petición", async () => {
            const data = {};
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: msg_mustEnterAllFieldsToLogin,
            });
        });
        test("Debe devolver 400 si se insertan propiedades no permitidas", async () => {
            const data = {
                email: validEmail,
                password: validPassword,
                foo: "some-random-data",
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: unexpectedFieldsMessage,
            });
        });
        test("Debe devolver 400 si email y password son cadenas vacías", async () => {
            const data = {
                email: "",
                password: "",
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: msg_mustEnterAllFieldsToLogin,
            });
        });
        test("Debe devolver 400 si email es una cadena vacía y password tiene valor", async () => {
            const data = {
                email: "",
                password: validPassword,
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: msg_mustEnterAllFieldsToLogin,
            });
        });
        test("Debe devolver 400 si password es una cadena vacía y email tiene valor", async () => {
            const data = {
                email: validEmail,
                password: "",
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: msg_mustEnterAllFieldsToLogin,
            });
        });
    });

    describe("Validaciones de formato", () => {
        describe("Email", () => {
            test("Debe devolver 400 si el email es demasiado largo", async () => {
                // Arrange
                const expectedStatus = 400;

                const expectedMatchObject = {
                    success: false,
                    message: emailRelatedData.tooLongMessage,
                };

                const longEmail = "a".repeat(255) + "@example.com";

                const data = {
                    email: longEmail,
                    password: validPassword,
                };

                // Act
                const res = await doRequest(loginUrl, data);

                // Assert
                expect(res.status).toBe(expectedStatus);
                expect(res.body).toMatchObject(expectedMatchObject);
            });

            test("Debe devolver 400 si el email tiene un formato inválido o caracteres no permitidos", async () => {
                const invalidEmails = [
                    "invalid-email",
                    "user@com",
                    "@example.com",
                    "user@",
                    "user@.com",
                    "userexample.com",
                    "user@ example.com",
                    "user@@example.com",
                    "user@example..com",
                    "user@domain,com",
                    "user@domain..com",
                ];
                for (const email of invalidEmails) {
                    const data = {
                        email,
                        password: validPassword,
                    };
                    const res = await doRequest(loginUrl, data);
                    expect(res.status).toBe(400);
                    expect(res.body).toMatchObject({
                        success: false,
                        message: emailRelatedData.badFormatMessage,
                    });
                }
            });

            test("Debe devolver 400 si el email tiene espacios antes o después", async () => {
                const data = {
                    email: "   user@example.com   ",
                    password: validPassword,
                };
                const res = await doRequest(loginUrl, data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: emailRelatedData.badFormatMessage,
                });
            });
        });
        describe("Password", () => {
            test("Debe devolver 400 si el password tiene menos de 6 caracteres", async () => {
                const data = {
                    email: "user@example.com",
                    password: "123",
                };
                const res = await doRequest(loginUrl, data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "Password must have 6 characters at least.",
                });
            });
            test("Debe devolver 400 si el password es demasiado largo", async () => {
                // CUAL ES EL LIMITE MAXIMO DE LONGITUD PARA UN PASSWORD Y UTILIZAR UNA CONSTANTE EN LUGAR DE UN NUMERO LITERAL.
                const longPassword = "a".repeat(19);
                const data = {
                    email: "user@example.com",
                    password: longPassword,
                };
                const res = await doRequest(loginUrl, data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "Password is too long.",
                });
            });
        });
    });

    describe("Credenciales inválidas", () => {
        test("Debe devolver 401 si el email es incorrecto", async () => {
            const data = {
                email: "wrong@example.com",
                password: "does-not-matter",
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(401);
            expect(res.body).toMatchObject({
                success: false,
                message: "Invalid credentials",
            });
        });
        test("Debe devolver 401 si el email es correcto pero password no coincide", async () => {
            const data = {
                email: "my_email12@gmail.com",
                password: "wrong-password",
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(401);
            expect(res.body).toMatchObject({
                success: false,
                message: "Invalid credentials",
            });
        });
    });

    describe("Validaciones de seguridad", () => {
        test("Debe devolver 400 si el email o password contienen caracteres sospechosos", async () => {
            const suspiciousInputs = [
                "' OR 1=1 --",
                "<script>alert('XSS')</script>",
                "'; DROP TABLE users; --",
            ];
            for (const input of suspiciousInputs) {
                const data = {
                    email: input,
                    password: "validPass123",
                };
                const res = await doRequest(loginUrl, data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "The email is badly formatted.",
                });
            }
        });
    });

    describe.only("Caso de éxito - usuario logueado", () => {
        test("Debe devolver 200 si las credenciales son correctas", async () => {
            // Arrange
            const expectedStatus = 200;

            const expectedMatchObject = {
                success: true,
                message: "You are logged!",
                accessToken: expect.any(String),
                user: {
                    id: expect.any(String),
                    firstname: expect.any(String),
                    lastname: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                    score: expect.any(Number),
                    createdAt: expect.any(String),
                },
            };

            const user = {
                firstname: "Elyssa",
                lastname: "Jones",
                username: "rory09",
                email: "elyssa50@hotmail.com",
                password: "rory_09123",
            };

            await userService.signup(user);

            const data = {
                email: user.email,
                password: user.password,
            };

            // Act
            const res = await doRequest(loginUrl, data);

            console.log(res.body);

            // Assert
            expect(res.status).toBe(expectedStatus);
            expect(res.body).toMatchObject(expectedMatchObject);
            expect(res.body.accessToken.split(".")).toHaveLength(3); // Verifica que el token tenga formato JWT
        });
    });
});
