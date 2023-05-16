var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId,
    passportLocalMongooseEmail = require('passport-local-mongoose-email'),
    emailValidator = require('email-validator');

var users = new Schema({
    _id: { type: objectId, auto: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: emailValidator.validate,
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "USER" },
    active: { type: Boolean, required: true, default: false },
    confirmation_code: { type: String, required: false, default: "" }
});

users.plugin(passportLocalMongooseEmail, {
    usernameField: 'email'
});

var user = mongoose.model('Users', users);

module.exports = user;