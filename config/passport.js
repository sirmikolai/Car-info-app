const session = require("express-session"),
    config = require("./auth"),
    users = require('../models/user'),
    bcrypt = require("bcryptjs"),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {

    app.use(session({
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
        usernameField: 'email',
    }, async (email, password, done) => {
        await users.findOne({ email: email }).then((userInfo) => {
            if (!userInfo) {
                return done(null, false, { reason: 1, message: "Invalid email address."});
            }
            if (!bcrypt.compareSync(password, userInfo.password)) {
                return done(null, false, { reason: 2, message: "Invalid password."});
            }
            if (userInfo.active == false) {
                return done(null, false, { reason: 3, message: "You need to activate your account before signing in."});
            }
            return done(null, userInfo);
        }).catch((error) => {
            console.error(error)
            return done(error, false);
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await users.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};