var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var connection = require('./config/db');
var expressLayouts = require('express-ejs-layouts');
var cors = require('cors');

//web routers
var carBrandWebRouter = require('./routes/web/carBrandWeb');
var carModelWebRouter = require('./routes/web/carModelWeb');
var userAdminWebRouter = require('./routes/web/userAdminWeb');
var userAuthWebRouter = require('./routes/web/userAuthWeb');
//api routers
var carBrandsRouter = require('./routes/api/carBrandApi');
var carModelsRouter = require('./routes/api/carModelApi');
var usersAdminRouter = require('./routes/api/userAdminApi');
var usersAuthRouter = require('./routes/api/userAuthApi');

var app = express();

// view engine setup
app.use(expressLayouts);
app.set('layout', './layout/main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const passport = require("./config/passport");
const authPassport = require('./middlewares/authPassport');
passport(app);

app.use(authPassport.getCurrentUser);

const messages = require('./middlewares/message');
app.use(messages.getSuccessMessage);
app.use(messages.getErrorMessage);

app.use(cors());

app.use('/', carBrandWebRouter);
app.use('/', carModelWebRouter);
app.use('/', userAdminWebRouter);
app.use('/', userAuthWebRouter);
app.use('/api/v1/users', usersAdminRouter);
app.use('/api/v1/users', usersAuthRouter);
app.use("/api/v1/car-brands", carBrandsRouter);
app.use("/api/v1/car-brands", carModelsRouter);

app.use(express.urlencoded({ extended: false }));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
