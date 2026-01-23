
const asyncHandler = require("../../middlewares/asyncHandler");
const User = require("../../models/User");
const { sendWelcomeEmail } = require("../../services/emai.service");
const { verifyGoogleToken } = require("../../services/oauth.service");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const jwt=require('../../utils/jwt')
const googleAuthController = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    const payload = await verifyGoogleToken(idToken);

    if (!payload) throw new ApiError(401, "Invalid Google Token");

    const { email, given_name, family_name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            firstName: given_name,
            lastName: family_name,
            email,
            avatar: picture,
            isEmailVerified: true, 
            status: "active"
        });
        await sendWelcomeEmail(user);
    }

    const token = jwt.generateToken({ id: user._id, role: user.role });
    res.status(200).json(new ApiResponse(200, "Login Success", { token, user }));
});