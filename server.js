import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { userRouter } from "./src/routes/user.routes.js";

config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT ?? 3000;

export const app = express();
app.use(express.json());
app.use("/users", userRouter);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

export const server = app.listen(PORT, () => {
    console.log(`\n--------------------------------------------------------\n`);
    console.log(`Server running on port ${PORT}\n`);
    console.log(`--------------------------------------------------------\n`);
})
