import mongoose from "mongoose";
import { config } from "dotenv";
import User from "../../src/models/user.model.js";
import { doRequest } from "./user.test.helper.js";

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

describe("PUT /users/update-stats", () => {
    const updateStatsUrl = "/users/update-stats";

    // 🔴 Casos negativos
    describe("Cuando faltan campos obligatorios", () => {
        test("Devuelve 400 si falta el userId", async () => {
            const data = {
                quizId: "abc123",
                category: "Science",
                score: 80,
                totalQuestions: 10,
                correctAnswers: 8,
                completionTime: 30,
                completedAt: new Date().toISOString(),
            };

            const res = await doRequest(updateStatsUrl, data, "application/json");

            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: "No has ingresado todos los campos",
            });
        });
    });

    // ✅ Casos positivos
    describe("Cuando se envía un cuerpo válido", () => {
        test("Actualiza las stats y devuelve 200", async () => {
            // Crear un usuario de prueba
            const user = await User.create({
                firstname: "Vivien",
                lastname: "Tromp",
                username: "clinton",
                email: "test@example.com",
                password: "hashed-password",
                stats: {
                    totalScore: 0,
                    totalCorrectAnswers: 0,
                    totalAnswersGiven: 0,
                    quizzesCompleted: 0,
                    highestScore: 0,
                    bestCategory: "",
                    categoryScores: {},
                },
            });

            const data = {
                userId: user._id.toString(),
                quizId: "quiz123",
                category: "Science",
                score: 90,
                totalQuestions: 10,
                correctAnswers: 9,
                completionTime: 45,
                completedAt: new Date().toISOString(),
            };

            const res = await doRequest(updateStatsUrl, data, "application/json");

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                message: "Estadísticas actualizadas correctamente", // Ajustalo a tu respuesta real
            });

            const updatedUser = await User.findById(user._id);
            expect(updatedUser!.stats.totalScore).toBe(90);
            expect(updatedUser!.stats.totalCorrectAnswers).toBe(9);
            expect(updatedUser!.stats.totalAnswersGiven).toBe(10);
            expect(updatedUser!.stats.quizzesCompleted).toBe(1);
        });
    });
});
