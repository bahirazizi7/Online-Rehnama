require("dotenv").config({ path: "../../.env" });
const { generateToken, verifyToken } = require("../utils/jwt");

const token = generateToken({ userId: "123", role: "user" });
console.log("Token:", token);

const decoded = verifyToken(token);
console.log("Decoded:", decoded);
