var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../lib/user');
mongoose.connect('mongodb://user:123456@ds257579.mlab.com:57579/nodejspractice');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if(!user) {
      return res.status(404).send();
    }

    user.comparePassword(password, (err, isMatch) => {
      if (isMatch && isMatch == true) {
        req.session.user = user;
        res.redirect('/dashboard');
        res.status(200).send();

      } else {
        return res.status(401).send();
      }

    })


  })

})

router.get('/dashboard', (req, res) => {
  if(!req.session.user) {
    res.redirect('/')
    return res.status(401).send();
  }
  res.render('dashboard');
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
  return res.status(200).send();
})

router.post('/register', (req, res) => {
  var emailaddress = req.body.emailaddress;
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  var newuser = new User();
  newuser.emailaddress = emailaddress;
  newuser.username = username;
  newuser.password = password;
  newuser.firstname = firstname;
  newuser.lastname = lastname;
  newuser.save((err, savedUser) => {
    if (err) {
      console.log(err);
      return res.status(400).send();
    }
    return res.status(200).send();
  })
})


module.exports = router;
