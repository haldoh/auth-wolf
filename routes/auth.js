/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the auth-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

// Requires
var express = require('express');
var router = express.Router();
var passport = require('passport');

var auth = require('../controllers/auth');

/* Local login
 */
router.route('/login')
	.post(auth.checkToken, passport.authenticate('local-login', {
		successRedirect: '/users/me',
		failureRedirect: '/fail'
	}));

/* Local signup
 */
router.route('/signup')
	.post(auth.checkToken, passport.authenticate('local-signup', {
		successRedirect: '/users/me',
		failureRedirect: '/fail'
	}));

/* Facebook auth
*/
router.route('/facebook')
// GET - Facebook authentication
	.get(auth.facebookAuth);

router.route('/facebook/callback')
// GET - Facebook authentication callback
	.get(auth.facebookAuthCallback, auth.extAuthRedirect);

/* Google auth
*/
router.route('/google')
// GET - Google authentication
	.get(auth.googleAuth);

router.route('/google/callback')
// GET - Google authentication callback
	.get(auth.googleAuthCallback, auth.extAuthRedirect);

/* Twitter auth
*/
router.route('/twitter')
// GET - Twitter authentication
	.get(auth.twitterAuth);

router.route('/twitter/callback')
// GET - Twitter authentication callback
	.get(auth.twitterAuthCallback, auth.extAuthRedirect);

/* Session setup
 */
router.route('/session_setup')
	.post(auth.checkToken, auth.sessionSetup);

/* Logout
 */
router.route('/logout')
	.get(auth.checkToken, auth.logout);

/* Check if logged in
 */
router.route('/test_auth')
	.get(auth.checkToken, auth.isAuthenticated, auth.authInfo);

module.exports = router;