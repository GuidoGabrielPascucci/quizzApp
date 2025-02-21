import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { UserRoutes } from "./src/routes/user.routes.js";
import { UserController } from "./src/controllers/user.controller.js";
import { UserService } from "./src/services/user.service.js";

config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT ?? 3000;

const userService = new UserService();
const userController = new UserController(userService);
const userRoutes = new UserRoutes(userController);

export const app = express();
app.use(express.json());
app.use("/users", userRoutes.userRouter);



//mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("\n✅ Connected to MongoDB");
} catch (error) {
    console.error("\n❌ Error connecting to MongoDB:", error);
    process.exit(1); // Detiene la aplicación si no puede conectarse
}



export const server = app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}\n`);
})
