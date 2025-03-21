import mongoose from "mongoose";
import "dotenv/config";
import { writeFileSync } from "node:fs";
import User from "../../../models/user.model.js";
import { generateFakeUser } from "./generate-fake-user.mock.js";
import { UserLoginData } from "./utils.mock.js";

// Insertar usuarios falsos en la base de datos
const seedUsers = async (numUsers: number) => {
    try {
        await mongoose.connect(process.env.MONGO_URI ?? "");
        await User.deleteMany({});
        const users = Array.from({ length: numUsers }, () =>
            generateFakeUser(usersDataForJson)
        );
        await User.insertMany(users);
        console.log(`\n✅ ${numUsers} usuarios falsos insertados con éxito.\n`);
        writeFileSync(
            "./src/dev/seed/users-mocked.json",
            JSON.stringify(usersDataForJson, null, 4)
        );
        console.log(`✅ Archivo users-mocked.json creado.\n`);
    } catch (error) {
        console.error("Error insertando usuarios falsos:", error);
    } finally {
        mongoose.connection.close();
    }
};

const usersDataForJson: UserLoginData[] = [];

// Ejecutar el script
await seedUsers(10);
