var express = require("express"),
  router = express.Router(),
  usersController = require("../../controllers/api/user_controller");

router.post("/sign-up", usersController.signUp);

router.get("/confirm/:token", usersController.confirmAccount);

router.post("/sign-in", usersController.signIn);

router.post("/reset-password", usersController.resetPassword);

module.exports = router;
