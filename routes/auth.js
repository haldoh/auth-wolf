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

/* Facebook signin
 */
router.route('/facebook/signin')
	.post(auth.checkApiToken, users.facebookSignin);

/* Google signin
 */
router.route('/google/signin')
	.post(auth.checkApiToken, users.googleSignin);

/* Twitter signin
 */
router.route('/twitter/signin')
	.post(auth.checkApiToken, users.twitterSignin);

module.exports = router;