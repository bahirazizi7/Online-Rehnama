const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("../utils/jwt");
const asyncHandler = require("../middlewares/asyncHandler")
const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")

const loginController = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials");
        }

        const token = jwt.generateToken({ id: user._id, role: user.role });
        res.json(new ApiResponse(200, "Login successful", user));

        // res.status(200).json({
        //     success: true,
        //     message: "Login successful",
        //     token,
        //     user: {
        //         id: user._id,
        //         fullName: user.fullName,
        //         email: user.email,
        //         role: user.role,
        //     },
        // });
    } catch (error) {
        next(error);
    }
});

module.exports = loginController;
