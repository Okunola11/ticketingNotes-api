const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const ROLES = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNewNote)
  .patch(noteController.updateNote)
  .delete(verifyRoles(ROLES.Admin, ROLES.Manager), noteController.deleteNote);

module.exports = router;
