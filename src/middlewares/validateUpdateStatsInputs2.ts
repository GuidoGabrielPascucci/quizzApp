import { Request, Response, NextFunction } from "express";

export function validateUpdateStatsInputs2(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const {
        userId,
        quizId,
        category,
        score,
        correctAnswers,
        totalQuestions,
        completedAt,
        completionTime,
    } = req.body;

    if (
        !userId ||
        !quizId ||
        !category ||
        score == null ||
        correctAnswers == null ||
        totalQuestions == null ||
        !completedAt ||
        completionTime == null
    ) {
        return res.status(400).json({
            success: false,
            message: "Datos faltantes o inválidos.",
        });
    }

    next();
}
