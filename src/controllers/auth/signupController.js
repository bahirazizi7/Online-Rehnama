const crypto = require("crypto");
const User = require("../../models/User");
const jwt = require("../../utils/jwt");
const asyncHandler = require("../../middlewares/asyncHandler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const { sendVerificationEmail, sendWelcomeEmail } = require("../../services/emai.service.js");


const signupController = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;


    if (!firstName || !lastName || !email || !password || !phone) {
        throw new ApiError(400, "Please provide all required fields");
    }


    const allowedRoles = ["buyer", "seller"];
    const finalRole = allowedRoles.includes(role) ? role : "buyer";


    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ 
        $or: [{ email: normalizedEmail }, { phone }] 
    });
    
    if (existingUser) {
        throw new ApiError(409, "User with this email or phone already exists");
    }


    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours


    const user = await User.create({
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        password,
        role: finalRole,
        verifyToken: verificationToken,
        verifyTokenExpiry: tokenExpiry,
        isEmailVerified: false, 
        authProvider: "local"
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

   
    await Promise.allSettled([
        sendVerificationEmail(user, verificationUrl),
        sendWelcomeEmail(user)
    ]);

   
    const token = jwt.generateToken({ id: user._id, role: user.role });

 
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verifyToken;
    delete userResponse.verifyTokenExpiry;

    res.status(201).json(
        new ApiResponse(201, "Registration successful! Please check your email to verify your account.", {
            token,
            user: userResponse
        })
    );
});

module.exports = signupController;