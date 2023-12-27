const User = require("../models/User");
const Note = require("../models/Notes");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route Get /users
// @acess private

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) res.status(204).json({ message: "There are no users" });
  res.json(users);
};
