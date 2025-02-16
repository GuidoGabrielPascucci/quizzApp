import mongoose from "mongoose";
import { userSchema } from "../schemas/userSchema.js";

export const User = mongoose.model('User', userSchema);