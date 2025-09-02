import { randomBytes } from "node:crypto";
const secretKey = randomBytes(64).toString("hex");
console.log(secretKey);
