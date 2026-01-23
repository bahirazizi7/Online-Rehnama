const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const user = new mongoose.Schema(
  {

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: { type: String, default: "default-avatar.png" },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },


    role: {
      type: String,
      enum: ["buyer", "seller", "admin", "agent"],
      default: "buyer"
    },
    activeRole:{
      type:String,
      default:"buyer"
    },


    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        savedAt: { type: Date, default: Date.now }
      }
    ],



    isEmailVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    lastLogin: Date,
    status: { type: String, enum: ["active", "suspended"], default: "active" },

    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },

  },
  { timestamps: true }
);


user.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

user.pre("save", async function () {
  if (!this.isModified("password")) return;

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});


module.exports = mongoose.model("User", user);