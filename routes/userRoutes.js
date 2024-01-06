const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const ROLES = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(verifyRoles(ROLES.Manager, ROLES.Admin), userController.createNewUser)
  .patch(verifyRoles(ROLES.Manager, ROLES.Admin), userController.updateUser)
  .delete(verifyRoles(ROLES.Admin), userController.deleteUser);

module.exports = router;
