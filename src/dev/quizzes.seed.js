import mongoose from "mongoose";
import { config } from "dotenv";
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import Quizz from '../models/quizz.model.js';
import { fileURLToPath } from 'url';

// Obtener el __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Ruta de la carpeta donde están los archivos JSON
const quizzesDir = join(__dirname, "../../otros/quizzes");

// Función para eliminar los documentos de MongoDB
const deleteQuizzDocuments = async () => {
    try {
        await Quizz.deleteMany({});
    }
    catch (error) {
        console.error("❌ Error al borrar los documentos:", error);
    }
}

// Función para leer todos los archivos JSON en la carpeta y subirlos a MongoDB
const importQuizzes = async () => {
    try {
        const files = readdirSync(quizzesDir); // Leer todos los archivos en la carpeta
        const bulkOps = [];

        for (const file of files) {
            if (file.endsWith(".json")) { // Filtrar solo los archivos JSON
                const filePath = join(quizzesDir, file);
                const rawData = readFileSync(filePath, "utf-8");
                const jsonData = JSON.parse(rawData);
                jsonData.forEach(quizz => bulkOps.push({ insertOne: { document: quizz } }))
            }
        }

        // Insertar todos los documentos de una vez
        if (bulkOps.length > 0) {
            await Quizz.bulkWrite(bulkOps);
            console.log("✅ Datos importados correctamente.");
        } else {
            console.log("⚠️ No se encontraron archivos JSON para importar.");
        }

        console.log("✅ Todos los archivos JSON han sido importados con éxito.");
        mongoose.connection.close(); // Cerrar la conexión después de importar los datos
    } catch (error) {
        console.error("❌ Error al importar los archivos JSON:", error);
    }
};

deleteQuizzDocuments();
importQuizzes();
