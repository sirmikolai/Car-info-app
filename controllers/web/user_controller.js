var users = require("../../models/user"),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    config = require("../../config/auth"),
    nodemailer = require("../../config/nodemailer"),
    passport = require('passport');

exports.signIn = function (req, res, next) {
    passport.authenticate('local', function (error, user, info) {
        if (error) { return next(error); }
        if (!user) {
            if (info.reason == 1) {
                req.session.errorMessage = info.message;
            }
            if (info.reason == 2) {
                req.session.errorMessage = info.message;
            }
            if (info.reason == 3) {
                req.session.errorMessage = info.message;
            }
            return res.redirect('/sign-in-form');
        }
        req.logIn(user, function (error) {
            if (error) { return next(error); }
            req.session.successMessage = "You have been signed in correctly.";
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.signOut = function (req, res, next) {
    req.logout(null, (err) => {
        if (err) {
            res.send(err);
        } else {
            req.session.successMessage = "You have been signed out correctly.";
            res.redirect('/');
        }
    });
}

exports.signUp = async (req, res, next) => {
    userExist = await users.exists({ email: req.body.email });
    if (userExist) {
        req.session.errorMessage = "There is already registered user with that email!";
        return res.redirect('/sign-up-form');
    } else {
        let token = jwt.sign({ email: req.body.email }, config.secret);
        var document = new users({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            confirmation_code: token
        });
        await document.save().then((userInfo) => {
            nodemailer.sendConfirmationEmailWeb(
                req.protocol + "://" + req.headers.host,
                userInfo.email,
                userInfo.confirmation_code,
            );
            req.session.successMessage = "Confirmation email has been sent. Check your spam folder as well just in case.";
            res.redirect("/")
        }).catch((error) => {
            next(error);
        });
    }
}

exports.confirmToken = async (req, res, next) => {
    let token = req.params.token;
    await users.findOneAndUpdate({ confirmation_code: token }, {
        active: true,
        confirmation_code: ""
    }).then(() => {
        req.session.successMessage = "Your account has been activated! Now, you can sign in.";
        res.redirect("/")
    }).catch((error) => {
        next(error);
    });
}

exports.getSignUpForm = async (req, res, next) => {
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    res.render("authentication/sign-up-form");
}

exports.getSignInForm = async (req, res, next) => {
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    res.render("authentication/sign-in-form");
}

exports.getAllUsers = async (req, res, next) => {
    await users.find({email: { $ne: "mikolaj.otreba@o2.pl" }}).select({ __v: 0, password: 0, confirmation_token: 0 }).then((usersInfo) => {
        res.locals.successMessage = req.session.successMessage;
        res.locals.errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render("users/index", { usersInfo: usersInfo });
    }).catch((error) => {
        next(error);
    });
}

exports.promoteUserToAdminRole = async (req, res, next) => {
    let id = req.params.id;
    await users.findByIdAndUpdate(id, { role: "ADMIN" }).select({ __v: 0, password: 0, confirmation_token: 0 }).then((userInfo) => {
        req.session.successMessage = "User with email '" + userInfo.email + "' has been promoted to ADMIN role."
        res.redirect("/admin-panel");
    }).catch((error) => {
        next(error);
    });
}

exports.demoteUserToUserRole = async (req, res, next) => {
    let id = req.params.id;
    await users.findByIdAndUpdate(id, { role: "USER" }).select({ __v: 0, password: 0, confirmation_token: 0 }).then((userInfo) => {
        req.session.successMessage = "User with email '" + userInfo.email + "' has been demoted to USER role."
        res.redirect("/admin-panel");
    }).catch((error) => {
        next(error);
    });
}

exports.deleteUser = async (req, res, next) => {
    let id = req.params.id;
    await users.findByIdAndDelete(id).then(() => {
        req.session.successMessage = "User has been removed."
        res.redirect("/admin-panel");
    }).catch((error) => {
        next(error);
    });
}

exports.getResetPasswordForm = async (req, res, next) => {
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    res.render("authentication/reset-password");
}

exports.resetPassword = async (req, res, next) => {
    let id = req.params.id;
    await users.findById({ _id: id }).then(async (userInfo) => {
        if (bcrypt.compareSync(req.body.current_password, userInfo.password)) {
            console.log("test");
            if (req.body.new_password == req.body.password_confirmation) {
                userInfo.password = bcrypt.hashSync(req.body.new_password, 8);
                await userInfo.save().then(() => {
                    req.session.successMessage = "Your password has been changed."
                    res.redirect("/");
                })
            }
        }
        else {
            req.session.errorMessage = "Incorrect current password!";
            res.redirect("/reset-password-form")
        }
    }).catch((error) => {
        next(error);
    });
}