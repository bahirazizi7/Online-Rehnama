const asyncHandler = require("../../middlewares/asyncHandler");
const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const verifyEmailController = asyncHandler(async (req, res) => {
    const { token } = req.query;

    const user = await User.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) throw new ApiError(400, "Invalid or expired token");

    user.isEmailVerified = true;
    user.status = "active";
    user.verifyToken = undefined; // Clear the token
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.status(200).json(new ApiResponse(200, "Account activated successfully!"));
});