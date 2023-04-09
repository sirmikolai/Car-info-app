var express = require('express'),
    router = express.Router(),
    usersController = require("../../controllers/web/user_controller"),
    authPassport = require('../../middlewares/authPassport');

router.get("/sign-in-form", usersController.getSignInForm);

router.post("/sign-in", usersController.signIn);

router.get("/sign-up-form", usersController.getSignUpForm);

router.post("/sign-up", usersController.signUp);

router.get("/sign-out", usersController.signOut);

router.get("/confirm/:token", usersController.confirmToken);

router.get("/reset-password-form", authPassport.verifyCurrentUser, usersController.getResetPasswordForm);

router.post("/reset-password/:id", authPassport.verifyCurrentUser, usersController.resetPassword);



module.exports = router;