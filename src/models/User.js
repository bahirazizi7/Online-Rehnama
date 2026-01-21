const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const user = new mongoose.Schema(
  {
   
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String , trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      index: true 
    },
    password: { type: String, required: true, select: false },  
    avatar: { type: String, default: "default-avatar.png" },
    phone: { type: String, required: true },

  
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user"
    },

    agentProfile: {
      agencyName: String,
      licenseNumber: String,
      bio: String,
      specialties: [String], 
      socialLinks: {
        whatsapp: String,
        facebook: String
      }
    },

    
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    myListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    

    isEmailVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    lastLogin: Date,
    status: { type: String, enum: ["active", "suspended"], default: "active" }
  },
  { timestamps: true }
);


user.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

user.pre("save", async function () {
  if (!this.isModified("password")) return;

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});


module.exports = mongoose.model("User", user);