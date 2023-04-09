var express = require('express'),
    router = express.Router(),
    usersController = require("../../controllers/web/user_controller"),
    authPassport = require('../../middlewares/authPassport');

router.get("/admin-panel", [authPassport.verifyCurrentUser, authPassport.isAdmin], usersController.getAllUsers);

router.get("/promote-role/:id", [authPassport.verifyCurrentUser, authPassport.isAdmin], usersController.promoteUserToAdminRole);

router.get("/demote-role/:id", [authPassport.verifyCurrentUser, authPassport.isAdmin], usersController.demoteUserToUserRole);

router.get("/delete-user/:id", [authPassport.verifyCurrentUser, authPassport.isAdmin], usersController.deleteUser);

module.exports = router;