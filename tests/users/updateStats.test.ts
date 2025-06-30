import mongoose from "mongoose";
import { config } from "dotenv";
import User from "../../src/models/user.model.js";
import { doRequest } from "./user.test.helper.js";

config();
const MONGO_URI = process.env.MONGO_URI ?? "";

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("PUT users/update-stats", () => {
    const updateStatsUrl = "/users/update-stats";

    // CASOS NEGATIVOS
    describe("Algún texto", () => {
        test("Algún texto", async () => {
            const data = "some-data";
            const contentType = "example/example";
            const res = await doRequest(updateStatsUrl, data, contentType);

            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: "Some message",
            });
        });
    });

    // CASOS POSITIVOS
    describe("Algún texto", () => {
        test("Algún texto", async () => {
            const data = "some-data";
            const contentType = "example/example";
            const res = await doRequest(updateStatsUrl, data, contentType);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                message: "Some message",
            });
        });
    });
});
