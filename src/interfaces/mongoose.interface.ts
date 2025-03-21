import { Document } from "mongoose";
import { IUser } from "./user.interface.js";

export type IUserDocument = IUser & Document;
