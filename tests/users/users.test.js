import mongoose from "mongoose";
import { server } from "../../server.js";
import { doRequest } from "./user.test.helper.js";
import { invalidRequestFormatMessage, mustEnterBothFieldsToLoginMessage, mustEnterBothFieldsToSignupMessage } from "../../src/middlewares/utils.middlware.js";
import { unexpectedFieldsMessage } from "../../src/schemas/loginSchema.js";
import { User } from "../../src/models/user.model.js";

beforeEach(async () => {
    await User.deleteMany({});
})

afterAll(() => {
    mongoose.connection.close();
    server.close();
});

describe('POST users/login', () => {
    const loginUrl = '/users/login';
    const emailGood = 'elyssa50@hotmail.com';
    //const passwordGood = 'rory_09';

    describe('Petición mal enviada', () => {
        test("Debe devolver 400 si el 'Content-Type' no es 'application/json'", async () => {
            const data = "email=elyssa50@hotmail.com&password=rory_09";
            const res = await doRequest(loginUrl, data, 'text/plain');
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: invalidRequestFormatMessage
            })
        })
        test("Debe devolver 400 si se envía un objeto vacío en el cuerpo de la petición", async () => {
            const data = {};
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsToLoginMessage
            });
        })
        test("Debe devolver 400 si se insertan propiedades no permitidas", async () => {
            const data = {
                email: "a_valid_email@example.com",
                password: "a-valid-password",
                foo: "some-random-data"
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: unexpectedFieldsMessage
            });
        })
        test("Debe devolver 400 si email y password son cadenas vacías", async () => {
            const data = {
                email: '',
                password: ''
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsToLoginMessage
            });
        })
        test("Debe devolver 400 si email es una cadena vacía y password tiene valor", async () => {
            const data = {
                email: '',
                password: 'some-password'
            }
            const res = await doRequest(loginUrl, data)
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsToLoginMessage
            });
        })
        test("Debe devolver 400 si password es una cadena vacía y email tiene valor", async () => {
            const data = {
                email: emailGood,
                password: ''
            };
            const res = await doRequest(loginUrl, data);    
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsToLoginMessage
            });
        })
    })
    describe('Validaciones de formato', () => {
        describe('Email', () => {
            // EMAIL DEMASIADO LARGO ( > 265 )
            test("Debe devolver 400 si el email es demasiado largo", async () => {
                const longEmail = 'a'.repeat(255) + '@example.com';
                const data = {
                    email: longEmail,
                    password: 'validPass123'
                };
                const res = await doRequest(loginUrl, data);                
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
                    const data = {
                        email,
                        password: 'validPassword123'
                    };
                    const res = await doRequest(loginUrl, data);
                    expect(res.status).toBe(400);
                    expect(res.body).toMatchObject({
                        success: false,
                        message: "The email is badly formatted."
                    });
                }
            });            
            test("Debe devolver 400 si el email tiene espacios antes o después", async () => {
                const data = {
                    email: '   user@example.com   ',
                    password: 'validPass123'
                };
                const res = await doRequest(loginUrl, data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "The email is badly formatted."
                });
            });
        })
        describe('Password', () => {
            
            test("Debe devolver 400 si el password tiene menos de 6 caracteres", async () => {
                const data = {
                    email: 'user@example.com',
                    password: '123'
                }
                const res = await doRequest(loginUrl, data);                
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "Password must have 6 characters at least."
                });
            });
            test("Debe devolver 400 si el password es demasiado largo", async () => {
                // CUAL ES EL LIMITE MAXIMO DE LONGITUD PARA UN PASSWORD Y UTILIZAR UNA CONSTANTE EN LUGAR DE UN NUMERO LITERAL.
                const longPassword = 'a'.repeat(19);
                const data = {
                    email: 'user@example.com',
                    password: longPassword
                };
                const res = await doRequest(loginUrl, data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "Password is too long."
                });
            });
        })
    })
    describe('Credenciales inválidas', () => {
        test("Debe devolver 401 si el email es incorrecto", async () => {
            const data = {
                email: 'wrong@example.com',
                password: 'does-not-matter'
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(401);
            expect(res.body).toMatchObject({
                success: false,
                message: "Invalid credentials"
            });
        });
        test("Debe devolver 401 si el email es correcto pero password no coincide", async () => {
            const data = {
                email: emailGood,
                password: "wrong-password"
            }
            const res = await doRequest(loginUrl, data);
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
                const data = {
                    email: input,
                    password: 'validPass123'
                };
                const res = await doRequest(loginUrl, data);                
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({
                    success: false,
                    message: "The email is badly formatted."
                });
            }
        });
    })
    describe.only('Caso de éxito - usuario logueado', () => {
        test("Debe devolver 200 si las credenciales son correctas", async () => {
            const user = {
                firstname: 'Elyssa',
                lastname: 'Jones',
                username: 'rory09',
                email: 'elyssa50@hotmail.com',
                password: 'rory_09123'
            };
            await User.create(user);
            const data = {
                email: user.email,
                password: user.password
            };
            const res = await doRequest(loginUrl, data);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                message: "You are logged!",
                accessToken: expect.any(String)
            });
        });
    })
});

describe.skip('POST users/signup', () => {

    const signupUrl = '/users/signup';

    describe('Caso de éxito, usuario registrado', () => {
        test('Debería registrar un usuario correctamente', async () => {
            const data = {
                firstname: "Guido",
                lastname: "Pascucci",
                username: "gp4s444",
                email: "g.g.pascucci@gmail.com",
                password: "p4sk1234"
            }
            const res = await doRequest(signupUrl, data);
            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: expect.any(String), 
                    firstname: expect.any(String),
                    lastname: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                    score: expect.any(Number),
                    createdAt: expect.any(String),  
                }
            });
        });
    })

    describe('Petición mal enviada', () => {
        test("Debería fallar si no se envía el body", async () => {
            const data = {};
            const res = await doRequest(signupUrl, data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: mustEnterBothFieldsToSignupMessage
            });
        });

        test('Deberia fallar si se envía como algo distinto de application/json', async () => {
            const data = 'email=g.g.pascucci@gmail.com&password=p4sk1234';
            const contentType = 'text/plain';
            const res = await doRequest(signupUrl, data, contentType);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: invalidRequestFormatMessage
            });
        })
    })

    describe('Validación de campos obligatorios', () => {
        test("Debería fallar si falta el username", async () => {
            const data = {
                email: "test@example.com",
                password: "SecurePass123!"
            };
            const res = await doRequest(signupUrl, data);
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/username es requerido/i);
        });
    })
    
    describe('Formato de datos inválidos', () => {
        test("Debería fallar si el email es inválido", async () => {
            const res = await doRequest("/signup", {
                username: "testUser",
                email: "invalid-email",
                password: "SecurePass123!"
            });
        
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/email inválido/i);
        });
    })

    describe('Usuario ya registrado', () => {
        test("Debería fallar si el usuario ya está registrado", async () => {
            // Primero registrar el usuario
            await doRequest("/signup", {
                username: "testUser",
                email: "test@example.com",
                password: "SecurePass123!"
            });
        
            // Intentar registrarlo de nuevo
            const res = await doRequest("/signup", {
                username: "testUser",
                email: "test@example.com",
                password: "SecurePass123!"
            });
        
            expect(res.status).toBe(409);
            expect(res.body.error).toMatch(/usuario ya registrado/i);
        });
    })

    describe('Inyección SQL y ataques XSS', () => {
        test("Debería rechazar intentos de inyección SQL", async () => {
            const res = await doRequest("/signup", {
                username: "' OR 1=1; --",
                email: "sql@example.com",
                password: "SecurePass123!"
            });
        
            expect(res.status).toBe(400);
        });
    
        test("Debería rechazar intentos de XSS", async () => {
            const res = await doRequest("/signup", {
                username: "<script>alert('xss')</script>",
                email: "xss@example.com",
                password: "SecurePass123!"
            });
        
            expect(res.status).toBe(400);
        });
    })

    describe('Datos persistidos correctamente', () => {
        test("Debería guardar el usuario en la base de datos", async () => {
            await doRequest("/signup", {
                username: "databaseUser",
                email: "dbuser@example.com",
                password: "SecurePass123!"
            });
        
            const user = await User.findOne({ email: "dbuser@example.com" });
            expect(user).not.toBeNull();
            expect(user.username).toBe("databaseUser");
        });
    })

})
