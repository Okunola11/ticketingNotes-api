const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["Employee"],
  },

  active: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
