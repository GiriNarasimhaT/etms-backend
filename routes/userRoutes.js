const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  requireLogin,
} = require("../controllers/userController");

const router = express.Router();

//Register route
router.post("/register", registerController);

//Login route
router.post("/login", loginController);

//Update
router.put("/update", requireLogin, updateUserController);

module.exports = router;
