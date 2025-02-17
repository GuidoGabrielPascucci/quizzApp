import { Router } from "express";

export const quizzRouter = Router();

quizzRouter.get('/quizz', (req, res) => {
    res.send("Funciona bien el /quizz");
});

quizzRouter.get('/quizz2', (req, res) => {
    res.send("Funciona bien el /quizz2");
})