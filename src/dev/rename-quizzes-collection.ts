import mongoose from "mongoose";
import "dotenv/config";

async function renameCollection() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const db = mongoose.connection.db;
        if (db) {
            await db.collection("quizzs").rename("quizzes");
            console.log("Colección renombrada exitosamente");
        } else {
            throw new Error("Error, la colección es undefined");
        }
    } catch (error) {
        console.error("Error al renombrar la colección:", error);
    } finally {
        mongoose.connection.close();
    }
}

renameCollection();
