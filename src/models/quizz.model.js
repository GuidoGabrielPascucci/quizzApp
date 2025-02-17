import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true }, // Texto de la pregunta
  options: [{ type: String, required: true }], // Opciones de respuesta
  correctAnswer: { type: String, required: true }, // Respuesta correcta
});

const quizzSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Título del quizz
  description: { type: String }, // Descripción opcional
  category: { type: String }, // Categoría del quizz (ejemplo: Ciencia, Historia)
  difficulty: { type: String, enum: ["Fácil", "Medio", "Difícil"] }, // Nivel de dificultad
  questions: [questionSchema], // Lista de preguntas del quizz
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al usuario que creó el quizz
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

const Quizz = mongoose.model("Quizz", quizzSchema);
export default Quizz;
