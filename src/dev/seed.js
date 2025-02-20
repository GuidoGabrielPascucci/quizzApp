import mongoose from "mongoose";
import { userSchema } from "../schemas/userSchema.js";
import { createUsersDataset } from "./mock.js";

try {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
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