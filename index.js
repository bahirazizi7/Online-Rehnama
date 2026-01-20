require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const shutdown = async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
