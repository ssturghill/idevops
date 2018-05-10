var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var User = require('../lib/user');
mongoose.connect('mongodb://user:123456@ds257579.mlab.com:57579/nodejspractice');

router.get('/', (req, res, next) => {
  res.render('registration');
});



module.exports = router;
