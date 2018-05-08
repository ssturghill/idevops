var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var expressValidator = require('express-validator');
var flash = require('connect-flash');


mongoose.connect('mongodb://user:123456@ds257579.mlab.com:57579/nodejspractice', (err) =>{
  if (err) {
    return console.log(err);
  }
  return console.log("Succesfully connected to MongoDB");
});

var indexRouter = require('./routes/index');
var registration = require('./routes/registration');
var signin = require('./routes/signin');
var dashboard = require('./routes/dashboard');
// var usersRouter = require('./routes/users');


// app.get('/registration.html', registration.index);

var app = express();

// view engine setup
// app.engine('html', require('ejs').renderFile);
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(session({secret:"qazwsxedcrfvQAZWSXEDCRFV",resave:false,saveUninitialized:true}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/registration', registration);
app.use('/signin', signin);
app.use('/dashboard', dashboard);
// app.use('/users', usersRouter);

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
