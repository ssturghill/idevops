var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../lib/user');
var app = express();
var check = ('express-validator/check');
mongoose.connect('mongodb://user:123456@ds257579.mlab.com:57579/nodejspractice');

app.use(bodyParser.urlencoded({ extended: true }));
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

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.post('/login', (req, res) => {
//   var username = req.body.username;
//   var password = req.body.password;
//
//   User.findOne({username: username}, (err, user) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send();
//     }
//     if(!user) {
//       return res.status(404).send();
//     }
//
//     user.comparePassword(password, (err, isMatch) => {
//       if (isMatch && isMatch == true) {
//         req.session.user = user;
//         res.redirect('/dashboard');
//         res.status(200).send();
//
//       } else {
//         return res.status(401).send();
//       }
//
//     })
//
//
//   })
//
// })
//
// router.get('/dashboard', (req, res) => {
//   // if(!req.session.user) {
//     // res.redirect('/')
//     // return res.status(401).send();
//   // }
//   res.render('dashboard');
// })

// router.get('/logout', (req, res) => {
//   req.session.destroy();
//   res.redirect('/');
//   return res.status(200).send();
// })

router.post('/register', (req, res, next) => {
  var emailaddress = req.body.emailaddress;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  // Validation
	req.check('firstname', 'Name is required').notEmpty();
  req.check('lastname', 'Name is required').notEmpty();
	req.check('emailaddress', 'Email is required').notEmpty();
	req.check('emailaddress', 'Email is not valid').isEmail();
	req.check('username', 'Username is required').notEmpty();
	req.check('password', 'Password is required').notEmpty();
	req.check('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  	if (errors) {
  		res.render('register', {
  			errors: errors
  		});
  	}
  	else {
  		//checking for email and username are already taken
  		User.findOne({ username: {
  			"$regex": "^" + username + "\\b", "$options": "i"
  	}}, function (err, user) {
  			User.findOne({ email: {
  				"$regex": "^" + email + "\\b", "$options": "i"
  		}}, function (err, mail) {
  				if (user || mail) {
  					res.render('register', {
  						user: user,
  						mail: mail
  					});
  				}
  				else {
  					var newUser = new User({
  						name: name,
  						email: email,
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
  	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/dashboard', failureFlash: true }),
  	function (req, res) {
  		res.redirect('dashboard');
  	});

  router.get('/logout', function (req, res) {
  	req.logout();

  	req.flash('success_msg', 'You are logged out');

  	res.redirect('/login');
  });
//   var newuser = new User();
//   newuser.emailaddress = emailaddress;
//   newuser.username = username;
//   newuser.password = password;
//   newuser.firstname = firstname;
//   newuser.lastname = lastname;
//   newuser.save((err, savedUser) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).send();
//     }
//     return res.status(200).send();
//   })
// })


module.exports = router;
