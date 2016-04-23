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

router.route('/:id')
	// GET - get data about a user
	.get(auth.checkApiToken, auth.checkUserToken, users.getUserById);

module.exports = router;