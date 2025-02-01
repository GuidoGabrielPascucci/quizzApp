import { Schema } from "mongoose";

export const userSchema = Schema({
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"], // Validación con mensaje de error
      trim: true // Elimina espacios al inicio y al final
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true, // Garantiza que el correo sea único
      lowercase: true, // Convierte el email a minúsculas automáticamente
      trim: true,
      match: [/\S+@\S+\.\S+/, "Por favor, proporciona un email válido"] // Validación de formato
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"], // Longitud mínima
      select: false // No incluye el password en las consultas por defecto
    },
    score: {
      type: Number,
      default: 0, // Por defecto, un usuario inicia con 0 puntos
      min: [0, "El puntaje no puede ser negativo"]
    },
    createdAt: {
      type: Date,
      default: Date.now, // Registra la fecha de creación del usuario
      immutable: true // Una vez establecido, no puede ser cambiado
    }
});

/* ESQUEMA de CHAT GPT
export const userSchema = Schema({
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"], // Validación con mensaje de error
      trim: true // Elimina espacios al inicio y al final
    },
    lastname: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true
    },
    age: {
      type: Number,
      min: [13, "La edad mínima es 13"], // Edad mínima requerida
      max: [120, "La edad máxima es 120"], // Edad máxima razonable
      required: [true, "La edad es obligatoria"]
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true, // Garantiza que el correo sea único
      lowercase: true, // Convierte el email a minúsculas automáticamente
      trim: true,
      match: [/\S+@\S+\.\S+/, "Por favor, proporciona un email válido"] // Validación de formato
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"], // Longitud mínima
      select: false // No incluye el password en las consultas por defecto
    },
    score: {
      type: Number,
      default: 0, // Por defecto, un usuario inicia con 0 puntos
      min: [0, "El puntaje no puede ser negativo"]
    },
    createdAt: {
      type: Date,
      default: Date.now, // Registra la fecha de creación del usuario
      immutable: true // Una vez establecido, no puede ser cambiado
    }
});
*/