require("dotenv").config({ path: "../../.env" }); // 👈 IMPORTANT
const connectDB = require("../config/db");
const User = require("../models/User");

const test = async () => {
  console.log("MONGO_URI:", process.env.MONGO_URI); // debug line

  await connectDB();

  const user = await User.create({
    firstName: "Test",
    lastName: "User",
    email: "test2@example.com",
    password: "123456",
    phone: "1234567890",
  });

  console.log("Saved user:", user);
  process.exit(0);
};

test();
