"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userStats = {
    quizzesTaken: {
        type: Number,
        default: 0,
        min: [0, "Quizzes taken can not be negative"],
    }, // Total de quizzes jugados
    quizzesCompleted: {
        type: Number,
        default: 0,
        min: [0, "Quizzes completed can not be negative"],
    }, // Quizzes finalizados con éxito
    totalScore: {
        type: Number,
        default: 0,
        min: [0, "Total score can not be negative"],
    }, // Puntos acumulados en total
    highestScore: {
        type: Number,
        default: 0,
        min: [0, "Highest score can not be negative"],
    }, // Puntuación más alta en un quiz
    totalCorrectAnswers: {
        type: Number,
        default: 0,
        min: [0, "Total correct answers can not be negative"],
    },
    totalAnswersGiven: {
        type: Number,
        default: 0,
        min: [0, "Total answers given can not be negative"],
    },
    bestCategory: {
        type: String,
        default: "",
    }, // Categoría donde mejor se desempeña
    rank: {
        type: String,
        default: "Novato",
    }, // Rango del usuario (se puede calcular dinámicamente)
    level: {
        type: Number,
        default: 1,
        min: [1, "Level can be one or more"],
    }, // Nivel basado en experiencia
    achievements: [{ type: String }], // Lista de logros desbloqueados
};
var userSchema = new mongoose_1.Schema({
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
    stats: userStats,
});
var User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
