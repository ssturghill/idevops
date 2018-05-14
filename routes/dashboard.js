var express = require('express');
var router = express.Router();

// router.get('/', (req, res) => {
//   res.render('dashboard');
// });
router.get('/', ensureAuthenticated, function(req, res){
	res.render('dashboard');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}


module.exports = router;
