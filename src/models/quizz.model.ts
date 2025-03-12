import { Schema, model } from "mongoose";

const questionSchema = new Schema({
    question: { type: String, required: true }, // Texto de la pregunta
    choices: [{ type: String, required: true }], // Opciones de respuesta
    correctAnswer: { type: Number, required: true }, // Respuesta correcta
});

const quizzSchema = new Schema({
    title: { type: String, required: true }, // Título del quizz
    description: { type: String }, // Descripción opcional
    category: { type: String }, // Categoría del quizz (ejemplo: Ciencia, Historia)
    difficulty: { type: String, enum: ["easy", "intermediate", "hard"] }, // Nivel de dificultad
    questions: [questionSchema], // Lista de preguntas del quizz
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Referencia al usuario que creó el quizz
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

const Quizz = model("Quizz", quizzSchema, "quizzes");
export default Quizz;
