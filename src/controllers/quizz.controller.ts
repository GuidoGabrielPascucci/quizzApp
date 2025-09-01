import { Request, Response } from "express";
import QuizzService from "@services/quizz.service.js";
import { QuizzFilters } from "@_types/quizz.types.js";

class QuizzController {
    quizzService: QuizzService;

    constructor(quizzService: QuizzService) {
        this.quizzService = quizzService;
    }

    obtenerTodos = async (req: Request, res: Response): Promise<any> => {
        try {
            const { category, difficulty } = req.query;
            const filters: QuizzFilters = {};
            if (category) filters.category = category as string;
            if (difficulty) filters.difficulty = difficulty as string;
            const quizzes = await this.quizzService.obtenerTodos(filters);
            return res.json(quizzes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener los quizzes" });
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<any> => {
        try {
            const quizz = await this.quizzService.obtenerPorId(req.params.id);
            if (!quizz)
                return res.status(404).json({ error: "Quiz no encontrado" });
            res.json(quizz);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el quiz" });
        }
    };

    crear = async (req: Request, res: Response): Promise<any> => {
        try {
            const nuevoQuiz = await this.quizzService.crear(req.body);
            return res.status(201).json(nuevoQuiz);
        } catch (error) {
            res.status(500).json({ error: "Error al crear el quiz" });
        }
    };

    actualizar = async (req: Request, res: Response): Promise<any> => {
        try {
            const quizActualizado = await this.quizzService.actualizar(
                req.params.id,
                req.body
            );
            if (!quizActualizado)
                return res.status(404).json({ error: "Quiz no encontrado" });
            res.json(quizActualizado);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el quiz" });
        }
    };

    eliminar = async (req: Request, res: Response): Promise<any> => {
        try {
            const quizEliminado = await this.quizzService.eliminar(
                req.params.id
            );
            if (!quizEliminado)
                return res.status(404).json({ error: "Quiz no encontrado" });
            res.json({ mensaje: "Quiz eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el quiz" });
        }
    };
}

export default QuizzController;
