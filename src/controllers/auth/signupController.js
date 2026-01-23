const User = require("../../models/User");
const jwt = require("../../utils/jwt");
const asyncHandler = require("../../middlewares/asyncHandler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const signupController = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, phone, password, role } = req.body;

 
    if (!firstName || !lastName || !email || !password || !phone) {
        throw new ApiError(400, "Please provide all required fields");
    }

  
    const allowedRoles = ["buyer", "seller"];
    const finalRole = allowedRoles.includes(role) ? role : "buyer";

  
    const existingUser = await User.findOne({ 
        $or: [{ email: email.toLowerCase() }, { phone }] 
    });
    
    if (existingUser) {
        throw new ApiError(409, "User with this email or phone already exists");
    }

   
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: finalRole,
    });

 
    const token = jwt.generateToken({ id: user._id, role: user.role });

   
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(
        new ApiResponse(201, "User registered successfully", {
            token,
            user: userResponse
        })
    );
});

module.exports = signupController;