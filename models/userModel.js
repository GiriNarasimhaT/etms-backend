const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    empId: {
      type: Number,
      required: [true, "Please add employee id"],
      unique: true,
      min: 7,
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add password"],
      min: 8,
      max: 64,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
