const Notes = require("../models/Notes");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all notes
// @route GET /notes
// @access private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.find().lean();
  if (!notes?.length) {
    return res.status(400).json({ message: "There are no notes" });
  }

  // add username to all notes before sending
  const notesAndUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesAndUser);
});

// @desc Create new notes
// @route POST /notes
// @access private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  // confirm that data is received
  if (!user || !title?.length || !text?.length) {
    return res.status(400).json({ message: "All data field are required" });
  }

  // check for duplicate title
  const duplicate = await Notes.findOne({ title }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Duplicate title, please choose another title" });
  }

  // create and store new note
  const note = await Notes.create({
    "user": user,
    "title": title,
    "text": text,
  });

  if (note) {
    return res.status(201).json({ message: `New note ${note.title} created.` });
  } else {
    return res.status(400).json({ message: "Invalid data entry" });
  }
});

// @desc Update a note
// @route PATCH /notes
// @access private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  // query for the exact note to be updated
  const note = await Notes.findById(id).exec();

  if (!note) {
    res.status(400).json({ message: "No note found" });
  }

  // check for duplicate note
  const duplicate = await Notes.findOne({ title }).lean().exec();
  // If duplicate, make sure only the intended note gets updated
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  //save the updates
  const updatedNote = await note.save();
  res
    .status(201)
    .json({ message: `Note ${note.title} has been successfully updated` });
});

// @desc Delete a note
// @route DELETE /notes
// @access private
const deleteNote = asyncHandler(async (req, res) => {
  const { id, completed } = req.body;

  if (!id) {
    res.status(400).json({ message: "Note ID is required" });
  }

  // Check if the note is assigned as completed
  if (completed === false) {
    return res
      .status(400)
      .json({ message: "The status of the note must be set to Completed" });
  }

  // find the specific note
  const note = await Notes.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note does not exist" });
  }

  const deleteNote = await note.deleteOne();

  const reply = `Note ${note.title} with ID: ${note._id} has been deleted`;

  res.json(reply);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
