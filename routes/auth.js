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
	.post(passport.authenticate('local-login', {
		successRedirect: '/users/me',
		failureRedirect: '/fail'
	}));

/* Local signup
 */
router.route('/signup')
	.post(passport.authenticate('local-signup', {
		successRedirect: '/users/me',
		failureRedirect: '/fail'
	}));

/* Logout
 */
router.route('/logout')
	.get(auth.logout);

/* Check if logged in
 */
router.route('/test_auth')
	.get(auth.isAuthenticated, auth.authInfo);

module.exports = router;