import mongoose from "mongoose";
import "dotenv/config";

async function renameCollection() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        // Renombrar la colección
        await db.collection("quizzs").rename("quizzes");

        console.log("Colección renombrada exitosamente");
    } catch (error) {
        console.error("Error al renombrar la colección:", error);
    } finally {
        mongoose.connection.close();
    }
}

renameCollection();
