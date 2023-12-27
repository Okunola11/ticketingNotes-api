const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: string,
    required: true,
  },
  roles: [
    {
      type: string,
      default: "Employee",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  password: {
    type: string,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
