const express = require("express");
const router = express.Router();


const signupController = require("../controllers/auth/signupController");
const loginController = require("../controllers/auth/loginController");


router.post("/signup", signupController);
router.post("/login", loginController);

module.exports = router;
