import { createRandomUser } from "./seed/mock.js";
import { writeFile } from "node:fs";

try {
    const randomUser = createRandomUser(true);
    writeFile("random-user.json", JSON.stringify(randomUser), (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
    });
} catch (err) {
    console.error(err);
}
