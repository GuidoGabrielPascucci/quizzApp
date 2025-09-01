import Quizz from "../models/quizz.model.js";
import { QuizzData, QuizzFilters } from "@_types/quizz.types.js";

class QuizzService {
    async obtenerTodos(filtros: QuizzFilters) {
        const quizzes = await Quizz.find(filtros);

        return quizzes.map((quiz) => ({
            id: quiz._id,
            title: quiz.title,
            description: quiz.description,
            category: quiz.category,
            difficulty: quiz.difficulty,
            questionsCount: quiz.questions.length,
        }));
    }

    async obtenerPorId(id: string) {
        return await Quizz.findById(id);
    }

    async crear(data: QuizzData) {
        return await Quizz.create(data);
    }

    async actualizar(id: string, data: QuizzData) {
        return await Quizz.findByIdAndUpdate(id, data, { new: true });
    }

    async eliminar(id: string) {
        return await Quizz.findByIdAndDelete(id);
    }
}

export default QuizzService;
