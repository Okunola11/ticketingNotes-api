const User = require("../models/User");
const Note = require("../models/Notes");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route GET /users
// @acess private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean(); // lean tells mongoose to give a json-like data without adding extras
  if (!users?.length) {
    return res.status(400).json({ message: "There are no users" });
  }
  res.json(users);
});

// @desc Create a new user
// @route POST /users
// @acess private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // confirm that the data is set
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // encrypting the password
  const hashedPwd = await bcrypt.hash(password, 10);

  // create and store new user
  const user = await User.create({
    "username": username,
    "password": hashedPwd,
    roles,
  });

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc update a user
// @route PATCH /users
// @acess private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;
  if (
    !id ||
    !username ||
    !roles.length ||
    !Array.isArray(roles) ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "All parameter field are required" });
  }
  const user = await User.findById(id).exec();
  // evaluate if the given id does not exist in the database
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // evaluate duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();
  // allow updates only to original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;
  }

  // save the updates
  const updatedUser = await user.save();
  res
    .status(201)
    .json({ message: `User ${updatedUser.username} data has been updated` });
});

// @desc  Delete a user
// @route DELETE /users
// @acess private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // check to see if the user has notes
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has an assigned note" });
  }

  // find the particular user
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: `User not found` });
  }

  const deleteUser = await user.deleteOne();

  const reply = `User ${user.username} with ID ${user._id} has been deleted`;

  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
