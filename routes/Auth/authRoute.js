const express = require('express');
const passport = require('passport');
require('../../controller/Users/passportSetup');
const router = express.Router();

//login success
// router.get('http://localhost:5000/login/success', (req, res) => {
// 	console.log('in success response');
// 	res.status(200).json({
// 		success: true,
// 		message: 'successfull',
// 		user: req.user,
// 		cookie: req.cookies,
// 	});
// });

//login failed
// router.get('/login/failed', (req, res) => {
// 	res.status(401).json({
// 		success: false,
// 		message: 'failed',
// 		user: null,
// 	});
// });

//logout
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('http://localhost:3000');
});

//google third party
router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }),
	(req, res) => {
		res.json('Ok')
	}
);

//redirect URI
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
	(req, res) => {
		res.redirect('http://localhost:3000/feed');
	}
);

module.exports = router;
