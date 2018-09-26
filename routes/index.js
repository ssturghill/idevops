var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../lib/user');
var delay = require('express-delay');

var app = express();

mongoose.connect('mongodb://user:123456@ds257579.mlab.com:57579/nodejspractice');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/register', (req, res, next) => {
  var emailaddress = req.body.emailaddress;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  // Validation
	req.checkBody('firstname', 'Name is required').notEmpty();
  	req.checkBody('lastname', 'Name is required').notEmpty();
	req.checkBody('emailaddress', 'Email is required').notEmpty();
	req.checkBody('emailaddress', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  	if (errors) {
  		res.render('registration', {
  			errors: errors
  		});
  	}
  	else {
  		// checking for email and username are already taken
  		User.findOne({ username: {
  			"$regex": "^" + username + "\\b", "$options": "i"
  	}}, function (err, user) {
  			User.findOne({ emailaddress: {
  				"$regex": "^" + emailaddress + "\\b", "$options": "i"
  		}}, function (err, mail) {
  				if (user || mail) {
  					res.render('registration', {
  						user: user,
  						mail: mail
  					});
  				}
  				else {
  					var newUser = new User({
  						username: username,
  						emailaddress: emailaddress,
              firstname: firstname,
              lastname: lastname,
  						username: username,
  						password: password
  					});
  					User.createUser(newUser, function (err, user) {
  						if (err) throw err;
  						console.log(user);
  					});
           	req.flash('success_msg', 'You are registered and can now login');
  					res.redirect('/login');
  				}
  			});
  		});
  	}
  });

  passport.use(new LocalStrategy(
  	function (username, password, done) {
  		User.getUserByUsername(username, function (err, user) {
  			if (err) throw err;
  			if (!user) {
  				return done(null, false, { message: 'Unknown User' });
  			}

  			User.comparePassword(password, user.password, function (err, isMatch) {
  				if (err) throw err;
  				if (isMatch) {
  					return done(null, user);
  				} else {
  					return done(null, false, { message: 'Invalid password' });
  				}
  			});
  		});
  	}));

  passport.serializeUser(function (user, done) {
  	done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
  	User.getUserById(id, function (err, user) {
  		done(err, user);
  	});
  });

  router.post('/login',
  	passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: true }));

  router.get('/logout', function (req, res) {
  	req.logout();

  	req.flash('success_msg', 'You are logged out');

  	res.redirect('/');
  });


module.exports = router;
