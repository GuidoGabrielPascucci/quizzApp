import Quizz from "../models/quizz.model.js";

class QuizzService {

    /*
    async obtenerTodos(filtros = {}) {
        return await Quizz.find(filtros).select('-questions');
    }
    */

    async obtenerTodos(filtros) {
        const quizzes = await Quizz.find(filtros);

        return quizzes.map(quiz => ({
            id: quiz._id,
            title: quiz.title,
            description: quiz.description,
            category: quiz.category,
            difficulty: quiz.difficulty,
            questionsCount: quiz.questions.length
        }));
    };

    async obtenerPorId(id) {
        return await Quizz.findById(id);
    }

    async crear(data) {
        return await Quizz.create(data);
    }

    async actualizar(id, data) {
        return await Quizz.findByIdAndUpdate(id, data, { new: true });
    }

    async eliminar(id) {
        return await Quizz.findByIdAndDelete(id);
    }

}

export default QuizzService;
