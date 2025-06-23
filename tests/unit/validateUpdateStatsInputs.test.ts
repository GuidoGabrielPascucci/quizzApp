import { jest } from "@jest/globals"; // Asumo que sigues usando módulos ES
import { Response } from "express"; // ¿DEBERIA IMPORTAR TAMBIEN REQUEST?
import {
    validateUpdateStatsInputs,
    invalidDataResponseObject,
} from "../../src/middlewares/user.middleware.js";
import { UserStatsNewData } from "../../src/types/user.types.js";

describe("validateUpdateStatsInputs", () => {
    function createRequestBody() {
        return {
            quizId: "abc",
            userId: "123",
            category: "History",
            score: 80,
            totalQuestions: 10,
            correctAnswers: 8,
            completionTime: 30,
            completedAt: new Date(),
        };
    }
    let body: Partial<UserStatsNewData> = {};
    const mockReq = (body: any): Request => ({ body } as Request);
    const mockRes = () => {
        // 1. Creamos un objeto simple con las funciones mock que necesitamos.
        const res = {
            // 2. Usamos .mockReturnThis() que está hecho exactamente para simular
            //    métodos encadenables. Es un atajo para .mockReturnValue(this).
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        // 3. Hacemos una aserción de tipo para que TypeScript trate nuestro
        //    objeto simple como si fuera un objeto 'Response' completo.
        return res as unknown as Response;
    };
    const mockNext = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        body = createRequestBody();
    });
    describe("Debería responder con 400 si falta alguna propiedad", () => {
        test("Falta userId", () => {
            delete body.userId;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
        test("Falta quizId", () => {
            delete body.quizId;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
        test("Falta category", () => {
            delete body.category;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
        test("Falta score", () => {
            delete body.score;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
        test("Falta correctAnswers", () => {
            delete body.correctAnswers;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
        test("Falta totalQuestions", () => {
            delete body.totalQuestions;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
        test("Falta completedAt", () => {
            delete body.completedAt;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
        test("Falta completionTime", () => {
            delete body.completionTime;
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
    describe("Deberia responder con 400 si alguna propiedad tiene un string vacío como valor", () => {
        test("quizId es una cadena vacía", () => {
            body.quizId = "";

            const req = mockReq(body);
            const res = mockRes();

            validateUpdateStatsInputs(req as any, res, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenLastCalledWith(
                invalidDataResponseObject
            );
        });
        test("userId es una cadena vacía", () => {
            body.userId = "";

            const req = mockReq(body);
            const res = mockRes();

            validateUpdateStatsInputs(req as any, res, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenLastCalledWith(
                invalidDataResponseObject
            );
        });
        test("category es una cadena vacía", () => {
            body.category = "";

            const req = mockReq(body);
            const res = mockRes();

            validateUpdateStatsInputs(req as any, res, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenLastCalledWith(
                invalidDataResponseObject
            );
        });
    });
    test("debería responder con 400 si score es null", () => {
        body.score = null as any;
        const req = mockReq(body);
        const res = mockRes();

        validateUpdateStatsInputs(req as any, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
        expect(mockNext).not.toHaveBeenCalled();
    });
    test("deberia responder con 400 si todos los datos están presentes pero alguno no respeta el tipo", () => {
        body.correctAnswers = "Dos" as any;

        const req = mockReq(body);
        const res = mockRes();

        validateUpdateStatsInputs(req as any, res, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenLastCalledWith(invalidDataResponseObject);
    });
    test("debería llamar a next() si todos los datos están presentes", () => {
        const req = mockReq(body);
        const res = mockRes();
        // FUNCION TESTEADA
        validateUpdateStatsInputs(req as any, res, mockNext);
        // El middleware llama a next()
        expect(mockNext).toHaveBeenCalled();
        // Espera que res.status() no haya sido llamada
        expect(res.status).not.toHaveBeenCalled();
    });
});
