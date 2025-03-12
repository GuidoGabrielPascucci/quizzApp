import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT ?? 3000;
const MONGO_URI = process.env.MONGO_URI ?? "";

try {
    await mongoose.connect(MONGO_URI);
    console.log("\n✅ Connected to MongoDB");
} catch (error) {
    console.error("\n❌ Error connecting to MongoDB:", error);
    process.exit(1);
}

export const server = app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}\n`);
});
