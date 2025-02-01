import mongoose from "mongoose";
import { config } from "dotenv";
import { userSchema } from "../userSchema.js";
import { createUsersDataset } from "./mock.js";

config();
const MONGO_URI = process.env.MONGO_URI;

try {
    await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    const User = mongoose.model("User", userSchema);
    const mockUsers = createUsersDataset(25);
    await User.insertMany(mockUsers);
    console.log("Datos insertados correctamente");
}
catch (err) {
    console.log("\n------------------------------------------------------------------------------------\n");
    console.log("Error al insertar datos\n");
    console.log(err);
}
finally {
    mongoose.connection.close();
}