import mongoose from "mongoose";
import { userSchema } from "../schemas/user.schema.js";

export const User = mongoose.model('User', userSchema);