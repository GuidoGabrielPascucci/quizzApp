import { Router } from "express";

class QuizzRoutes {

    constructor(quizzController) {
        this.quizzController = quizzController;
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', this.quizzController.obtenerTodos);
        this.router.get('/:id', this.quizzController.obtenerPorId);
        this.router.post('/', this.quizzController.crear);
        this.router.put('/:id', this.quizzController.actualizar);
        this.router.delete('/:id', this.quizzController.eliminar);
    }

    initAppRouter(app) {
        app.use('/quizzes', this.router)
    }

}

export default QuizzRoutes;