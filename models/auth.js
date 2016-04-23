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
var jwt = require('jsonwebtoken');

var config = require('../config/config');

// Generate a user token
module.exports.generateUserToken = function (user, callback) {

	// Token payload
	var payload = {
		id: user.id,
		displayName: user.displayName
	};

	// Secret
	var secret = config.jwtSecret;

	// Options
	var options = {
		expiresIn: '7d'
	};

	// Create token
	jwt.sign(payload, secret, options, callback);
};

// Verify a user token
module.exports.verifyUserToken = function (token, callback) {

	// Secret
	var secret = config.jwtSecret;

	// Options
	var options = {};

	// Verify token
	jwt.verify(token, secret, options, callback);
};