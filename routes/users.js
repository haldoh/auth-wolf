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
var router = require('express').Router();
var auth = require('../controllers/auth');
var users = require('../controllers/users');

router.route('/me')
// GET - get data about the logged user
	.get(auth.isAuthenticated, users.loggedUserData);

module.exports = router;