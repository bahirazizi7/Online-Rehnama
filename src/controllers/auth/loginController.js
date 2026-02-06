const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("../../utils/jwt");
const asyncHandler = require("../../middlewares/asyncHandler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

 
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }


  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

 
  if (user.status === "suspended") {
    throw new ApiError(403, "Account is suspended");
  }


  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }


  const token = jwt.generateToken({
    id: user._id,
    role: user.role,
  });

  user.password = undefined;

  res.status(200).json(
    new ApiResponse(200, "Login successful", {
      token,
      user,
    })
  );
});

module.exports = loginController;
