import { jest } from "@jest/globals"; // Asumo que sigues usando módulos ES
import { Response } from "express"; // ¿DEBERIA IMPORTAR TAMBIEN REQUEST?
import { validateUpdateStatsInputs } from "../../src/middlewares/user.middleware.js";
import { UserStatsNewData } from "../../src/types/user.types.js";
import { invalidDataResponseObject } from "../../src/utils/user.utils.js";

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
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        return res as unknown as Response;
    };
    const mockNext = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        body = createRequestBody();
    });
    describe("Debería responder con status 400 si falta alguna propiedad", () => {
        const table = [
            "quizId",
            "userId",
            "category",
            "score",
            "totalQuestions",
            "correctAnswers",
            "completionTime",
            "completedAt",
        ];
        test.each(table)("Falta el campo %s", (prop) => {
            delete body[prop as keyof typeof body];
            const req = mockReq(body);
            const res = mockRes();
            validateUpdateStatsInputs(req as any, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
    describe("Deberia responder con status 400 si alguna propiedad tiene un string vacío como valor", () => {
        const table = ["quizId", "userId", "category"];
        test.each(table)("%s es una cadena vacía", (prop) => {
            body = { ...body, [prop]: "" };
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
    test("Debería responder con 400 si score es null", () => {
        body.score = null as any;
        const req = mockReq(body);
        const res = mockRes();
        validateUpdateStatsInputs(req as any, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(invalidDataResponseObject);
        expect(mockNext).not.toHaveBeenCalled();
    });
    test("Deberia responder con 400 si todos los datos están presentes pero alguno no respeta el tipo", () => {
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
        validateUpdateStatsInputs(req as any, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
