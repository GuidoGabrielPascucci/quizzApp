import { Response } from "express";
import { validateUpdateStatsInputs } from "@middlewares/users/updateStats.middleware";
import { UserStatsNewData } from "@_types/user.types";
import { invalidDataResponseObject } from "@utils/user.utils";

describe("validateUpdateStatsInputs", () => {
    //#region SETUP
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

    const createRequestBody = () => ({
        quizId: "abc",
        userId: "123",
        category: "History",
        score: 80,
        totalQuestions: 10,
        correctAnswers: 8,
        completionTime: 30,
        completedAt: new Date(),
    });

    beforeEach(() => {
        jest.clearAllMocks();
        body = createRequestBody();
    });

    function runTestedUnit(): Response {
        const req = mockReq(body);
        const res = mockRes();
        validateUpdateStatsInputs(req as any, res, mockNext);
        return res;
    }

    function successExpected(res: Response) {
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    }

    function notSuccessExpected(res: Response) {
        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenLastCalledWith(invalidDataResponseObject);
    }
    //#endregion
    //#region TESTS
    describe("Caso de éxito", () => {
        test("Debería llamar a next() si pasa la validación de esquema", () => {
            const res = runTestedUnit();
            successExpected(res);
        });
    })

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
            const res = runTestedUnit();
            notSuccessExpected(res);
        });
    });

    describe("Tipo de dato inválido", () => {
        //#region SETUP
        let fields: Array<string> = [];
        let values: Array<any> = [];

        const invariantValues = [
            {},
            [],
            true,
            undefined,
            null
        ];

        beforeEach(() => {
            fields = [];
            values = [];
        })

        function runParameterizedTest(field: string, values: any[]) {
            values.forEach(value => {
                body = { ...body, [field]: value };
                const res = runTestedUnit();
                notSuccessExpected(res);
            })
        }
        //#endregion 
        //#region TESTS
        describe("Propiedades de tipo string", () => {

            fields = ["quizId", "userId", "category"];
            values = [1, ...invariantValues];

            test.each(fields)("Deberia devolver 400 si %s no es un string", (field) => {
                runParameterizedTest(field, values);
            });
        })

        describe("Propiedades de tipo number", () => {

            fields = ["score", "correctAnswers", "totalQuestions", "completionTime"];
            values = ["string", ...invariantValues];

            test.each(fields)("Deberia devolver 400 si %s no es un número", (field) => {
                runParameterizedTest(field, values);
            });
        })

        describe("Propiedades de tipo date", () => {

            fields = ["completedAt"];
            values = ["string", 1, ...invariantValues];

            test.each(fields)("Deberia devolver 400 si %s no es una fecha", (field) => {
                runParameterizedTest(field, values);
            });
        })
        //#endregion
    });

    test("Debería responder con 400 si score es null", () => {
        body.score = null as any;
        const res = runTestedUnit();
        notSuccessExpected(res);
    });

    test("Deberia responder con 400 si todos los datos están presentes pero alguno no respeta el tipo", () => {
        body.correctAnswers = "Dos" as any;
        const res = runTestedUnit();
        notSuccessExpected(res);
    });
    //#endregion
});
