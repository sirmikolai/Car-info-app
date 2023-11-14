const { EventEmitter } = require("nodemailer/lib/xoauth2");
var users = require("../../models/user"),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    config = require("../../config/auth"),
    nodemailer = require("../../config/nodemailer");

exports.getAllUsers = async (req, res, next) => {
    await users.find().select({ __v: 0, password: 0, confirmation_token: 0 }).then((usersInfo) => res.status(200).send(usersInfo)).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when getting users from DB",
        error
    }));
}

exports.getUserById = async (req, res, next) => {
    let id = req.params.id;
    await users.findById(id).select({ __v: 0, password: 0, confirmation_token: 0 }).then((userInfo) => {
        if (userInfo != null) {
            if (userInfo.email == 'mikolaj.otreba@o2.pl') {
                throw "There are not any user with id: " + id;
            } else {
                res.status(200).send(userInfo);
            }
        } else {
            throw "There are not any user with id: " + id;
        }
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when getting user from DB",
        error
    }));
}

exports.promoteUserToAdminRole = async (req, res, next) => {
    let id = req.params.id;
    await users.findByIdAndUpdate(id, { role: "ADMIN" }).select({ __v: 0, password: 0, confirmation_token: 0 }).then((userInfo) => {
        if (userInfo != null) {
            res.status(204).send();
        } else {
            throw "There are not any user with id: " + id;
        }
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when promoting user to ADMIN role",
        error
    }));
}

exports.demoteUserToUserRole = async (req, res, next) => {
    let id = req.params.id;
    await users.findByIdAndUpdate(id, { role: "USER" }).select({ __v: 0, password: 0, confirmation_token: 0 }).then((userInfo) => {
        if (userInfo != null) {
            res.status(204).send();
        } else {
            throw "There are not any user with id: " + id;
        }
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when demoting user to USER role",
        error
    }));
}

exports.deleteUser = async (req, res, next) => {
    let id = req.params.id;
    await users.findByIdAndDelete(id).then(() => res.sendStatus(204)).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when deleting user from DB",
        error
    }));
}

exports.signUp = async (req, res, next) => {
    userExist = await users.exists({ email: req.body.email });
    if (userExist) {
        res.status(409).json({
            message: "There is already registered user with that email",
        });
    } else {
        let token = jwt.sign({ email: req.body.email }, config.secret);
        var document = new users({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            confirmation_code: token
        });
        await document.save().then((userInfo) => {
            nodemailer.sendConfirmationEmailRest(
                req.protocol + "://" + req.headers.host,
                userInfo.email,
                userInfo.confirmation_code,
            );
            let resJsonObj = {
                _id: userInfo._id,
                email: userInfo.email,
                role: userInfo.role,
                message: "User was registered successfully! Please check your email to confirm your account."
            }
            res.status(201).send(resJsonObj)
        }).catch((error) => res.status(500).json({
            message: "Ooops! Something went wrong when creating account",
            error
        }));
    }
}

exports.signIn = async (req, res, next) => {
    let jsonObj = req.body;
    await users.findOne({ email: jsonObj.email }).then(async (userInfo) => {
        console.log(userInfo);
        if (bcrypt.compareSync(jsonObj.password, userInfo.password)) {
            console.log(userInfo);
            if (userInfo.active == true) {
                var token = jwt.sign({ id: userInfo._id }, config.secret, {
                    expiresIn: 3600
                });
                let resJsonObj = {
                    _id: userInfo._id,
                    email: userInfo.email,
                    role: userInfo.role,
                    token: token
                }
                res.status(201).send(resJsonObj)
            } else {
                res.status(403).send({ message: "You have to confirm your account before signing in" })
            }
        } else {
            res.status(401).send({ message: "Invalid credentials" })
        }
    }).catch((error) => res.status(500).json({
        message: "There is no any registered user with that email",
        error
    }));
};

exports.confirmAccount = async (req, res, next) => {
    let token = req.params.token;
    await users.findOneAndUpdate({ confirmation_code: token }, {
        active: true,
        confirmation_code: ""
    }).then(() => res.status(200).send("User has been activated.")).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when activating user",
        error
    }));
}

exports.resetPassword = async (req, res, next) => {
    let jsonObj = req.body;
    userExist = await users.exists({ email: jsonObj.email });
    if (!userExist) {
        res.status(500).json({
            message: "There is no any registered user with that email",
        });
    } else {
        if (jsonObj.new_password != jsonObj.confirm_new_password) {
            res.status(409).send({ "message": "Passwords are not identical" });
        } else {
            await users.findOneAndUpdate({ email: jsonObj.email }, { password: bcrypt.hashSync(jsonObj.new_password, 8) }).then(() => {
                res.status(204).send()
            }).catch((error) => res.status(500).json({
                message: "Ooops! Something went wrong when getting user from DB",
                error
            }));
        }
    }
}