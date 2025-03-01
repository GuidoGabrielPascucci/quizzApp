import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";

beforeEach(async () => {
  await User.deleteMany({});
})

afterAll(async () => {
  await mongoose.connection.close();
});
