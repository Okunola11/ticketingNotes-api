const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: string,
      required: true,
    },
    text: {
      type: string,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // option to give time stamps as required by the User
  }
);

noteSchema.plugin(AutoIncrement, {
  //this plugin creates a separate counter collection where it insert and tracks sequential number into our notes
  id: "ticketNums",
  inc_field: "ticket",
  start_seq: 500,
});

module.exports = mongoose.model("Note", noteSchema);
