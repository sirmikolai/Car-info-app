var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
var connection = mongoose.connect('mongodb+srv://mikolajotreba:lfxRelbOmRRIrcca@carsdatabase.i8bzxfg.mongodb.net/?retryWrites=true&w=majority');

module.exports = connection;