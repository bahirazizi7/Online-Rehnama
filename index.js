require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const mongoose = require("mongoose");

const asyncHandler = require("./src/middlewares/asyncHandler");
const ApiError = require("./src/utils/ApiError");
const ApiResponse = require("./src/utils/ApiResponse");

const PORT = process.env.PORT || 5000;


connectDB();


app.get(
    "/health",
    asyncHandler(async (req, res) => {
        res.status(200).json(
            new ApiResponse(200, "Server is healthy", {
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            })
        );
    })
);


const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


const shutdown = asyncHandler(async () => {
    console.log("🛑 Shutting down server...");

    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log("✅ MongoDB connection closed");
    } else {
        throw new ApiError(500, "MongoDB connection already closed");
    }

    process.exit(0);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
