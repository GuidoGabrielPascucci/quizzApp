import "dotenv/config";
import User from "@models/user.model";
import { doRequest } from "./user.test.helper";
import {
    invalidRequestFormatMessage,
    mustEnterAllFieldsToSignupMessage,
} from "@middlewares/utils.middleware.js";
import {
    emailLimits,
    emailMessages,
} from "@schemas/users/email/email.constants";
import { userAlreadyExistsMessage } from "@schemas/users/signup.schema";
import { setHooks } from "./utils";

describe("POST users/signup", () => {
    //#region GLOBALS
    const signupUrl = "/users/signup";
    let userData: any;
    const requiredFields = [
        "firstname",
        "lastname",
        "username",
        "email",
        "password",
    ];
    //#endregion

    //#region HOOKS
    setHooks(() => {
        userData = {
            firstname: "Guido",
            lastname: "Pascucci",
            username: "gp4s444",
            email: "valid_email10@example.com",
            password: "P4sk_1234",
        };
    });
    //#endregion

    //#region TESTS
    describe("Caso de éxito, usuario registrado", () => {
        test("Debería registrar un usuario correctamente", async () => {
            const res = await doRequest(signupUrl, "POST", userData);

            expect(res.status).toBe(201);
            expect(res.body).toStrictEqual({
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
            });
        });

        test("Debería guardar el usuario en la base de datos", async () => {
            await doRequest(signupUrl, "POST", userData);
            
            const { email, username } = userData;
            const user = await User.findOne({ email });

            expect(user).not.toBeNull();
            expect(user?.username).toBe(username);
        });
    });

    describe("Petición mal enviada", () => {
        test("Debería fallar si no se envía el body", async () => {
            const data = {};

            const res = await doRequest(signupUrl, "POST", data);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: mustEnterAllFieldsToSignupMessage,
            });
        });

        test("Deberia fallar si el body no es JSON", async () => {
            const data = "email=g.g.pascucci@gmail.com&password=p4sk1234";
            const contentType = "text/plain";

            const res = await doRequest(signupUrl, "POST", data, contentType);

            expect(res.status).toBe(400);
            expect(res.body).toStrictEqual({
                success: false,
                message: invalidRequestFormatMessage,
            });
        });
    });

    describe("Validación de campos obligatorios", () => {
        test.each(requiredFields)(
            "Debería devolver 400 si falta el %s",
            async (field) => {
                const { [field]: _, ...data } = userData;
                const res = await doRequest(signupUrl, "POST", data);
                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({
                    success: false,
                    message: mustEnterAllFieldsToSignupMessage,
                });
            }
        );
    });

    describe("Formato de datos inválido", () => {

        describe("Tipo incorrecto", () => {
            const invalidTypes = [
                { field: "email", value: 123 },
                { field: "email", value: { $ne: "" } },
                { field: "username", value: 123 },
                { field: "username", value: {} },
                { field: "password", value: 123 },
                { field: "password", value: {} },
                { field: "firstname", value: 123 },
                { field: "firstname", value: {} },
                { field: "lastname", value: 123 },
                { field: "lastname", value: {} },
            ];

            test.each(invalidTypes)(
                "Debería devolver 400 si %s no es string",
                async ({ field, value }) => {
                    const data = { ...userData, [field]: value };
                    const res = await doRequest(signupUrl, "POST", data);
                    expect(res.status).toBe(400);
                }
            );
        });

        describe.skip("Valor inválido - No cumple reglas de negocio", () => {
            // tests
        });
    });

    describe("Usuario ya registrado", () => {
        test("Debería fallar si el usuario ya está registrado", async () => {
            await doRequest(signupUrl, "POST", userData);

            const res = await doRequest(signupUrl, "POST", userData);

            expect(res.status).toBe(409);
            expect(res.body).toStrictEqual({
                success: false,
                message: userAlreadyExistsMessage,
            });
        });
    });

    describe("Inyección NoSQL y ataques XSS", () => {
        // XSS: Cross-Site Scripting ----> HAY QUE IMPLEMENTAR LA FUNCIONALIDAD
        test("Debería rechazar intentos de XSS", async () => {
            userData.firstname = "<script>alert('xss')</script>";

            const res = await doRequest(signupUrl, "POST", userData);

            console.log(res.body);

            expect(res.status).toBe(400);
        });

        test("Rechaza inyección NoSQL en el campo email", async () => {
            userData.email = { $ne: "" };

            const res = await doRequest(signupUrl, "POST", userData);

            console.log(res.body);
            expect(res.status).toBe(400); // o 422 (Unprocessable Entity) según cómo manejes errores
            expect(res.body).toStrictEqual({
                success: false,
                message: emailMessages.notString,
            });
        });
    });
    //#endregion
});
