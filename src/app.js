const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);


app.use(errorHandler);

module.exports = app;
