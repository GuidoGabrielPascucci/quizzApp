import { Schema, model, Types, SchemaDefinitionProperty } from "mongoose";
import { IUser, IQuizResult, IUserStats } from "../interfaces/index.js";

const quizHistorySchema = new Schema<IQuizResult>({
    quizId: {
        type: Types.ObjectId,
        ref: "Quiz",
        required: true,
        // get: (id: Types.ObjectId) => id.toString(),
    } as unknown as SchemaDefinitionProperty<string>,
    //quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true }, // Referencia al quiz jugado
    category: { type: String, required: true }, // Categoría del quiz
    score: { type: Number, required: true }, // Puntuación obtenida
    correctAnswers: { type: Number, required: true }, // Respuestas correctas
    totalQuestions: { type: Number, required: true }, // Total de preguntas en el quiz
    completedAt: { type: Date, default: Date.now }, // Fecha en que se completó
});

const statsSchema = new Schema<IUserStats>({
    totalScore: { type: Number, default: 0 },
    totalCorrectAnswers: { type: Number, default: 0 },
    totalAnswersGiven: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    bestCategory: { type: String, default: "" },
    categoryScores: { type: Map, of: Number, default: {} }
});

const userSchema = new Schema<IUser>({
    firstname: {
        type: String,
        required: [true, "El nombre es obligatorio"], // Validación con mensaje de error
        trim: true, // Elimina espacios al inicio y al final
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true, // Garantiza que el correo sea único
        lowercase: true, // Convierte el email a minúsculas automáticamente
        trim: true,
        match: [/\S+@\S+\.\S+/, "Por favor, proporciona un email válido"], // Validación de formato
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"], // Longitud mínima
        select: false, // No incluye el password en las consultas por defecto
    },
    createdAt: {
        type: Date,
        default: Date.now, // Registra la fecha de creación del usuario
        immutable: true, // Una vez establecido, no puede ser cambiado
    },
    avatar: { type: String },
    stats: statsSchema,
    quizHistory: [quizHistorySchema],
});

const User = model("User", userSchema);
export default User;
