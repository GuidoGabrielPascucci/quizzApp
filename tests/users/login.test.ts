import "dotenv/config";
import {
    invalidRequestFormatMessage,
    mustEnterAllFieldsToLoginMessage,
} from "@middlewares/utils.middleware";
import {
    unexpectedFieldsMessage,
    invalidCredentialsMessage,
} from "@schemas/users/login.schema";
import { emailMessages } from "@schemas/users/constants";
import {
    passwordMessages,
    passwordLimits,
} from "@schemas/users/password/password.constants";
import { doRequest } from "./user.test.helper";
import { setHooks } from "./utils";

describe("POST users/login", () => {
    //#region GLOBALS
    const loginUrl = "/users/login";
    const validEmail = "valid_email10@example.com";
    const validPassword = "P4sk_1234";
    const newUser = {
        firstname: "Lionel",
        lastname: "Messi",
        username: "lionel10",
        email: validEmail,
        password: validPassword,
    };
    //#endregion

    //#region HOOKS
    setHooks();
    //#endregion

    //#region TESTS
    describe("Petición mal enviada", () => {
        test("Debe devolver 400 si el 'Content-Type' no es 'application/json'", async () => {
            const data = "email=elyssa50@hotmail.com&password=rory_09";
            const contentType = "text/plain";

            const res = await doRequest(loginUrl, "POST", data, contentType);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: invalidRequestFormatMessage,
            });
        });

        test("Debe devolver 400 si se envía un objeto vacío en el cuerpo de la petición", async () => {
            const data = {};

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: mustEnterAllFieldsToLoginMessage,
            });
        });

        test("Debe devolver 400 si email y password son cadenas vacías", async () => {
            const data = {
                email: "",
                password: "",
            };

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: mustEnterAllFieldsToLoginMessage,
            });
        });

        test("Debe devolver 400 si email es una cadena vacía y password tiene valor", async () => {
            const data = {
                email: "",
                password: validPassword,
            };

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: mustEnterAllFieldsToLoginMessage,
            });
        });

        test("Debe devolver 400 si password es una cadena vacía y email tiene valor", async () => {
            const data = {
                email: validEmail,
                password: "",
            };

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: mustEnterAllFieldsToLoginMessage,
            });
        });

        test("Debe devolver 400 si se insertan propiedades no permitidas", async () => {
            const data = {
                email: validEmail,
                password: validPassword,
                foo: "some-random-data",
            };

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: unexpectedFieldsMessage,
            });
        });
    });

    describe("Validaciones de formato", () => {
        describe("Email", () => {
            test("Debe devolver 400 si el email es demasiado largo", async () => {
                const longEmail = "a".repeat(255) + "@example.com";
                const data = {
                    email: longEmail,
                    password: validPassword,
                };

                const res = await doRequest(loginUrl, "POST", data);

                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({
                    success: false,
                    message: emailMessages.tooLong,
                });
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

                for (const invalidEmail of invalidEmails) {
                    const data = {
                        email: invalidEmail,
                        password: validPassword,
                    };

                    const res = await doRequest(loginUrl, "POST", data);

                    expect(res.status).toBe(400);
                    expect(res.body).toStrictEqual({
                        success: false,
                        message: emailMessages.badFormat,
                    });
                }
            });

            test("Debe devolver 400 si el email tiene espacios antes o después", async () => {
                const data = {
                    email: "   user@example.com   ",
                    password: validPassword,
                };

                const res = await doRequest(loginUrl, "POST", data);

                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({
                    success: false,
                    message: emailMessages.badFormat,
                });
            });
        });

        describe("Password", () => {
            test("Debe devolver 400 si el password es demasiado corto", async () => {
                const n = passwordLimits.min - 1;
                const shortPassword = "a".repeat(n);
                const data = {
                    email: validEmail,
                    password: shortPassword,
                };

                const res = await doRequest(loginUrl, "POST", data);

                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({
                    success: false,
                    message: passwordMessages.tooShort,
                });
            });

            test("Debe devolver 400 si el password es demasiado largo", async () => {
                const n = passwordLimits.max + 1;
                const longPassword = "a".repeat(n);
                const data = {
                    email: validEmail,
                    password: longPassword,
                };

                const res = await doRequest(loginUrl, "POST", data);

                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({
                    success: false,
                    message: passwordMessages.tooLong,
                });
            });
        });
    });

    describe("Credenciales inválidas", () => {
        test("Debe devolver 401 si el email es incorrecto", async () => {
            const data = {
                email: "wrong@example.com",
                password: validPassword,
            };

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(401);
            expect(res.body).toStrictEqual({
                success: false,
                message: invalidCredentialsMessage,
            });
        });

        test("Debe devolver 401 si el email es correcto pero password no coincide", async () => {
            const signupUrl = "/users/signup";

            await doRequest(signupUrl, "POST", newUser);

            const data = {
                email: validEmail,
                password: "WrongPassword_123",
            };

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(401);
            expect(res.body).toStrictEqual({
                success: false,
                message: invalidCredentialsMessage,
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
                    password: validPassword,
                };

                const res = await doRequest(loginUrl, "POST", data);

                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({
                    success: false,
                    message: "The email is badly formatted.",
                });
            }
        });
    });

    describe("Caso de éxito - usuario logueado", () => {
        test("Debe devolver 200 si las credenciales son correctas", async () => {
            const signupUrl = "/users/signup";

            await doRequest(signupUrl, "POST", newUser);

            const data = {
                email: newUser.email,
                password: newUser.password,
            };

            const res = await doRequest(loginUrl, "POST", data);

            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual({
                success: true,
                message: "You are logged!",
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
            });
            expect(res.body.accessToken.split(".")).toHaveLength(3);
        });
    });
    //#endregion
});
