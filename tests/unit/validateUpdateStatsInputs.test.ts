import { validateUpdateStatsInputs } from "../../src/middlewares/user.middleware.js";
import { Request, Response, NextFunction } from "express";

describe("validateUpdateStatsInputs", () => {
    const mockReq = (body: any): Request => ({ body } as Request);

    const mockRes = () => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    const mockNext = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("debería llamar a next() si todos los datos están presentes", () => {
        const body = {
            userId: "123",
            quizId: "abc",
            category: "History",
            score: 80,
            correctAnswers: 8,
            totalQuestions: 10,
            completedAt: new Date(),
            completionTime: 30,
        };
        const req = mockReq(body);
        const res = mockRes();

        validateUpdateStatsInputs(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test.skip("debería responder con 400 si falta userId", () => {
        const req = mockReq({
            quizId: "abc",
            category: "History",
            score: 80,
            correctAnswers: 8,
            totalQuestions: 10,
            completedAt: new Date(),
            completionTime: 30,
        });

        const res = mockRes();

        validateUpdateStatsInputs(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Datos faltantes o inválidos.",
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    test.skip("debería responder con 400 si score es null", () => {
        const req = mockReq({
            userId: "123",
            quizId: "abc",
            category: "History",
            score: null,
            correctAnswers: 8,
            totalQuestions: 10,
            completedAt: new Date(),
            completionTime: 30,
        });

        const res = mockRes();

        validateUpdateStatsInputs(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
