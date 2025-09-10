import mongoose from "mongoose";
import User from "@models/user.model";

const MONGO_URI = process.env.MONGO_URI ?? "";

async function deleteAllUsers() {
    await User.deleteMany({});
}

export async function setHooks(cb?: () => void | Promise<void>) {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URI);
    });
    
    beforeEach(async () => {
        await deleteAllUsers();
        if (cb) {
            cb();
        }
    });
    
    afterAll(async () => {
        await deleteAllUsers();
        await mongoose.connection.close();
    });
}
