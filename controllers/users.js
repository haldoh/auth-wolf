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
var user = require('../models/user');
var auth = require('../models/auth');

var error = require('../config/error');
var logger = require('../config/logger');

/*** ROUTES ***/

/** Get a user by its ID
 */
module.exports.getUserById = function (req, res, next) {

	// Get ID from URL
	var userId = req.params.hasOwnProperty('id') ? req.params.id : -1;

	if (userId === -1)
		return error.send('400', '1', 'warn', res, 'controllers.user.getUserById', 'Parameter missing from call: ' + JSON.stringify(req.params));
	else {

		// Retrieve user
		return user.getById(userId, function (usrErr, usr) {
			if (usrErr)
				return error.send('500', '1', 'error', res, 'controllers.user.getUserById', 'Error retrieving user from DB : ' + JSON.stringify(usrErr));
			else if (!usr)
				return error.send('404', '1', 'warn', res, 'controllers.user.getUserById', 'Requested user not found: ' + userId);
			else {

				// Turn to normal JSON
				var resUser = usr.toObject();

				// Passowrd digest is not needed
				delete resUser.password;

				// Return user
				return res.send(resUser);
			}
		});
	}
};

/** Authenticate a user with email and password
 */
module.exports.localAuth = function (req, res, next) {
	
	// Get data from request
	var email = req.body.hasOwnProperty('email') ? req.body.email : -1;
	var password = req.body.hasOwnProperty('password') ? req.body.password : -1;

	// Check data
	if (email === -1 || password === -1) {
		req.body.password = 'REMOVED FROM LOGS';
		return error.send('400', '1', 'warn', res, 'controllers.user.newLocalUser', 'Parameter missing from call: ' + JSON.stringify(req.body));
	} else {

		// Check if user exists
		return user.getByEmail(email, function (usrErr, usr) {
			if (usrErr)
				return error.send('500', '1', 'error', res, 'controllers.user.localAuth', 'Error retrieving user from DB : ' + JSON.stringify(usrErr));
			else if (!usr)
				return error.send('404', '1', 'warn', res, 'controllers.user.localAuth', 'Requested user not found: ' + email);
			else {

				// Check user password
				if (!user.checkPassword(usr, password))
					return error.send('401', '1', 'warn', res, 'controllers.user.localAuth', 'Given password does not match user: ' + email);
				else {

					// Return auth token
					return auth.generateUserToken(usr, function (token) {
						return res.send({
							token: token
						});
					});	
				}
			}
		});
	}
};

/** Store a new local user
 */
module.exports.newLocalUser = function (req, res, next) {

	// Get data from request
	var email = req.body.hasOwnProperty('email') ? req.body.email : -1;
	var password = req.body.hasOwnProperty('password') ? req.body.password : -1;
	var displayName = req.body.hasOwnProperty('name') ? req.body.name : email;

	// Check data
	if (email === -1 || password === -1) {
		req.body.password = 'REMOVED FROM LOGS';
		return error.send('400', '1', 'warn', res, 'controllers.user.newLocalUser', 'Parameter missing from call: ' + JSON.stringify(req.body));
	} else {

		// Create user
		return user.newLocalUser(email, password, displayName, function (usrErr, usr) {
			if (usrErr)
				return error.send('500', '1', 'error', res, 'controllers.user.newLocalUser', 'Error creating user : ' + JSON.stringify(usrErr));
			else {

				// Return auth token
				return auth.generateUserToken(usr, function (token) {
					return res.send({
						token: token
					});
				});
			}
		});
	}
};