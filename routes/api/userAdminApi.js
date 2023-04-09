var express = require("express"),
  router = express.Router(),
  usersController = require("../../controllers/api/user_controller"),
  auth = require("../../middlewares/authJwt");

router.get("/", [auth.verifyToken, auth.isAdmin], usersController.getAllUsers);

router.get("/:id", [auth.verifyToken, auth.isAdmin], usersController.getUserById);

router.post("/promote-role/:id", [auth.verifyToken, auth.isAdmin], usersController.promoteUserToAdminRole);

router.post("/demote-role/:id", [auth.verifyToken, auth.isAdmin], usersController.demoteUserToUserRole);

router.delete("/:id", [auth.verifyToken, auth.isAdmin], usersController.deleteUser);

module.exports = router;
