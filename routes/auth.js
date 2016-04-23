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
var users = require('../controllers/users');

/* Local signin
 */
router.route('/local/signin')
	// POST - Get auth token using local credentials
	.post(auth.checkApiToken, users.localAuth);

/* Local signup
 */
router.route('/local/signup')
	// POST - Create new user and get auth token
	.post(auth.checkApiToken, users.newLocalUser);

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
	.post(auth.checkApiToken, auth.sessionSetup);

/* Logout
 */
router.route('/logout')
	.get(auth.checkApiToken, auth.logout);

/* Check if logged in
 */
router.route('/test_auth')
	.get(auth.checkApiToken, auth.isAuthenticated, auth.authInfo);

module.exports = router;