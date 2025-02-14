import request from "supertest";
import mongoose from "mongoose";

import { app, server } from "../../server.js";
import { emailRelatedData, passwordRelatedData } from "../../src/schemas/emailPasswordSchema.js";
import { invalidRequestFormatMessage, mustEnterBothFieldsMessage } from "../../src/middlewares/loginMw.js";
import { unexpectedFieldsMessage } from "../../src/schemas/loginSchema.js";

describe("POST users/login", () => {
    const loginUrl = "/users/login";
    const emailGood = "elyssa50@hotmail.com";
    const passwordGood = "rory_09";

    describe('Petición mal enviada', () => {
        test("Debe devolver 400 si el 'Content-Type' no es 'application/json'", async () => {
            const res = await request(app)
                .post(loginUrl)
                .set("Content-Type", "text/plain")
                .send("email=elyssa50@hotmail.com&password=rory_09");
    
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: invalidRequestFormatMessage
            })
        })
        test("Debe devolver 400 si se envía un objeto vacío en el cuerpo de la petición", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({});
    
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsMessage
            });
        })
        test("Debe devolver 400 si se insertan propiedades no permitidas", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({
                    email: "a_valid_email@example.com",
                    password: "a-valid-password",
                    foo: "some-random-data"
                });
    
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: unexpectedFieldsMessage
            });
        })
        test("Debe devolver 400 si email y password son cadenas vacías", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({ email: "", password: "" });
    
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsMessage
            });
        })
        test("Debe devolver 400 si email es una cadena vacía y password tiene valor", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({ email: "", password: "some-password" });
    
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsMessage
            });
        })
        test("Debe devolver 400 si password es una cadena vacía y email tiene valor", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({ email: emailGood, password: "" });
    
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsMessage
            });
        })
    })
    describe('Validaciones de formato', () => {
        describe('Email', () => {
            // EMAIL DEMASIADO LARGO ( > 265 )
            test("Debe devolver 400 si el email es demasiado largo", async () => {
                const longEmail = "a".repeat(255) + "@example.com";
                const res = await request(app)
                    .post(loginUrl)
                    .send({ email: longEmail, password: "validPass123" });

                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "Your email is too long."
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
                    "user@domain..com"
                ];
                for (const email of invalidEmails) {
                    const res = await request(app)
                        .post(loginUrl)
                        .send({ email, password: "validPassword123" });
            
                    expect(res.status).toBe(400);
                    expect(res.body).toMatchObject({
                        success: false,
                        message: "The email is badly formatted."
                    });
                }
            });            
            test("Debe devolver 400 si el email tiene espacios antes o después", async () => {
                const res = await request(app)
                    .post(loginUrl)
                    .send({ email: "   user@example.com   ", password: "validPass123" });

                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "The email is badly formatted."
                });
            });
        })
        describe('Password', () => {
            // CHEQUAR ESTO PORQUE ESTÁ MAL
            test("Debe devolver 400 si password no cumple requisitos de formato", async () => {
                const res = await request(app)
                    .post(loginUrl)
                    .send({ email: "some.valid.email@example.com", password: "HAY QUE PONER UN PASSWORD QUE NO CUMPLA LOS REQUISITOS" });

                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "Password is too long."
                });
            })
            test("Debe devolver 400 si el password tiene menos de 6 caracteres", async () => {
                const res = await request(app)
                    .post(loginUrl)
                    .send({ email: "user@example.com", password: "123" });

                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "Password must have 6 characters at least."
                });
            });
            test("Debe devolver 400 si el password es demasiado largo", async () => {
                const longPassword = "a".repeat(19);
                const res = await request(app)
                    .post(loginUrl)
                    .send({ email: "user@example.com", password: longPassword });

                expect(res.status).toBe(400);
                // Puedes personalizar el mensaje si decides establecer un límite máximo de longitud.
            });
        })
    })
    describe('Credenciales inválidas', () => {
        test("Debe devolver 401 si el email es incorrecto", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({ email: "wrong@example.com", password: "does-not-matter" });
    
            expect(res.status).toBe(401);
            expect(res.body).toMatchObject({
                success: false,
                message: "Invalid credentials"
            });
        });
        test("Debe devolver 401 si el email es correcto pero password no coincide", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({ email: emailGood, password: "wrong-password" });
    
            expect(res.status).toBe(401);
            expect(res.body).toMatchObject({
                success: false,
                message: "Invalid credentials"
            });
        });
    })
    describe('Validaciones de seguridad', () => {
        test("Debe devolver 400 si el email o password contienen caracteres sospechosos", async () => {
            const suspiciousInputs = [
                "' OR 1=1 --",
                "<script>alert('XSS')</script>",
                "'; DROP TABLE users; --"
            ];
            for (const input of suspiciousInputs) {
                const res = await request(app)
                    .post(loginUrl)
                    .send({ email: input, password: "validPass123" });
    
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "The email is badly formatted."
                });
            }
        });
    })
    describe('Caso de éxito - usuario logueado', () => {
        test("Debe devolver 200 si las credenciales son correctas", async () => {
            const res = await request(app)
                .post(loginUrl)
                .send({ email: emailGood, password: passwordGood });
    
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                message: "You are logged!",
                accessToken: expect.any(String)
            });
        });
    })
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});