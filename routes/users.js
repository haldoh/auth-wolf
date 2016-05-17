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
	// GET - get data about the user token owner
	.get(auth.checkApiToken, auth.checkUserToken, users.getTokenUser);	

router.route('/:id')
	// GET - get data about a user
	.get(auth.checkApiToken, auth.checkUserToken, users.getUserById);

router.route('/list')
	// POST - list users given a list of IDs
	.post(auth.checkApiToken, auth.checkUserToken, users.getMultiUserById);

module.exports = router;