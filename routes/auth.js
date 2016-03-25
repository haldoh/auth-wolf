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

router.route('/login')
	.post(passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/fail'
	}));

router.route('/signup')
	.post(passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/fail'
	}));

module.exports = router;