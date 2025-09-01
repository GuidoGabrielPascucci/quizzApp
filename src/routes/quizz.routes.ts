import { Router, Express } from "express";
import QuizzController from "@controllers/quizz.controller.js";

class QuizzRoutes {
    quizzController: QuizzController;
    router: Router;

    constructor(quizzController: QuizzController) {
        this.quizzController = quizzController;
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.quizzController.obtenerTodos);
        this.router.get("/:id", this.quizzController.obtenerPorId);
        this.router.post("/", this.quizzController.crear);
        this.router.put("/:id", this.quizzController.actualizar);
        this.router.delete("/:id", this.quizzController.eliminar);
    }

    initAppRouter(app: Express) {
        app.use("/quizzes", this.router);
    }
}

export default QuizzRoutes;
