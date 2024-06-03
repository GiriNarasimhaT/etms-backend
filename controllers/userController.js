const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireLogin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//Register
const registerController = async (req, res) => {
  try {
    const { empId, email, password } = req.body;
    console.log("Request Body:", req.body);
    //validation
    if (!empId) {
      return res.status(400).send({
        success: false,
        message: "Employee id is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password is required and Minimum 8 character long",
      });
    }
    //Checking if existing user
    const existingUser = await userModel.findOne({ empId });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User with that employee id already exists",
      });
    }
    //Encrypt Password
    const hashedPassword = await hashPassword(password);

    //Update db
    const user = await userModel({
      empId,
      email,
      password: hashedPassword,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Registration Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Registration failed",
      error,
    });
  }
};

//Login
const loginController = async (req, res) => {
  try {
    const { empId, password } = req.body;
    //Validation
    if (!empId || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide all login details",
      });
    }
    //Find user
    const user = await userModel.findOne({ empId });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }
    //Check Password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Wrong password",
      });
    }
    //Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined; //removing password from user variable
    return res.status(200).send({
      success: true,
      message: "Login Successfull",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Login Failed",
      error,
    });
  }
};

//Update
const updateUserController = async (req, res) => {
  try {
    const { empId, email, password } = req.body;
    const user = await userModel.findOne({ empId });
    if (password && password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password is less than required length",
        error,
      });
    }
    const encryptedPassword = password
      ? await hashPassword(password)
      : undefined;

    const updatedUser = await userModel.findOneAndUpdate(
      { empId },
      {
        email: email || user.email,
        password: encryptedPassword || user.password,
      },
      {
        new: true,
      }
    );
    updatedUser.password = undefined;
    return res.status(200).send({
      success: true,
      message: "Profile update successfull",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error occured while updating profile",
      error,
    });
  }
};

module.exports = {
  requireLogin,
  registerController,
  loginController,
  updateUserController,
};
