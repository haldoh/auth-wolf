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

/** Get multiple users by ID
 */
module.exports.getMultiUserById = function (req, res, next) {

	// Get IDs from request body
	var userIds = req.body.hasOwnProperty('ids') ? req.body.ids : -1;

	if (userIds === -1)
		return error.send('400', '1', 'warn', res, 'controllers.user.getMultiUserById', 'Parameter missing from call: ' + JSON.stringify(req.params));
	else {

		// Parse IDs
		var parsedUserIds = userIds.split(',');

		// Retrieve user
		return user.getMultiUserById(parsedUserIds, function (usrErr, usrs) {
			if (usrErr)
				return error.send('500', '1', 'error', res, 'controllers.user.getMultiUserById', 'Error retrieving users from DB : ' + JSON.stringify(usrErr));
			else if (!usrs)
				return error.send('404', '1', 'warn', res, 'controllers.user.getMultiUserById', 'no users not found: ' + userId);
			else {

				var result = [];

				for (var i = 0; i < usrs.length; i += 1) {

					// Turn to normal JSON
					var resUser = usrs[i].toObject();

					// Passowrd digest is not needed
					delete resUser.password;

					// Push user in result array
					result.push(resUser);
				}

				// Return users
				return res.send(result);
			}
		});
	}
};

/** Get a user by its auth token
 */
module.exports.getTokenUser = function (req, res, next) {

	// Get ID from req
	var userId = req.tokenUser && req.tokenUser.hasOwnProperty('id') ? req.tokenUser.id : -1;

	if (userId === -1)
		return error.send('400', '1', 'warn', res, 'controllers.user.getTokenUser', 'Parameter missing from call: ' + JSON.stringify(req.params));
	else {

		// Retrieve user
		return user.getById(userId, function (usrErr, usr) {
			if (usrErr)
				return error.send('500', '1', 'error', res, 'controllers.user.getTokenUser', 'Error retrieving user from DB : ' + JSON.stringify(usrErr));
			else if (!usr)
				return error.send('404', '1', 'warn', res, 'controllers.user.getTokenUser', 'Requested user not found: ' + userId);
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
					return error.send('400', '2', 'warn', res, 'controllers.user.localAuth', 'Given password does not match user: ' + email);
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
	var displayName = req.body.hasOwnProperty('name') ? req.body.name : null;

	// Check data
	if (email === -1 || password === -1) {
		req.body.password = 'REMOVED FROM LOGS';
		return error.send('400', '1', 'warn', res, 'controllers.user.newLocalUser', 'Parameter missing from call: ' + JSON.stringify(req.body));
	} else {

		// Check if user already exists
		return user.getByEmail(email, function (checkErr, checkUsr) {

			if (checkErr)
				return error.send('500', '1', 'error', res, 'controllers.user.newLocalUser', 'Error checking existing user: ' + JSON.stringify(checkErr));
			else if (checkUsr)
				return error.send('400', '2', 'error', res, 'controllers.user.newLocalUser', 'Email already in use.');
			else {
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
		});
	}
};

/** Facebook user signin
 *  Check if given Facebook user exists, create it if missing, and return auth token
 */
module.exports.facebookSignin = function (req, res, next) {

	// Get data from request
	var id = req.body.hasOwnProperty('id') ? req.body.id : -1;
	var token = req.body.hasOwnProperty('token') ? req.body.token : -1;
	var email = req.body.hasOwnProperty('email') ? req.body.email : -1;
	var name = req.body.hasOwnProperty('name') ? req.body.name : -1;

	// Check data
	if (id === -1 || token === -1 || email === -1 || name === -1)
		return error.send('400', '1', 'warn', res, 'controllers.user.facebookSignin', 'Parameter missing from call: ' + JSON.stringify(req.body));
	else {

		// Check if user already exists
		return user.getByFacebookId(id, function (checkErr, checkUsr) {
			if (checkErr)
				return error.send('500', '1', 'error', res, 'controllers.user.facebookSignin', 'Error checking user: ' + JSON.stringify(checkErr));
			else if (checkUsr) {

				// Store new Facebook token
				return user.updateFacebookToken(id, token, function (updErr, updRes) {
					if (updErr)
						return error.send('500', '1', 'error', res, 'controllers.user.facebookSignin', 'Error updating user token: ' + JSON.stringify(updErr));
					else {

						// User already exists, return auth token
						return auth.generateUserToken(checkUsr, function (token) {
							return res.send({
								token: token
							});
						});
					}
				});
			} else {

				// New user, store it
				return user.newFacebookUser(id, token, email, name, function (newErr, newUsr) {
					if (newErr)
						return error.send('500', '1', 'error', res, 'controllers.user.facebookSignin', 'Error creating new user: ' + JSON.stringify(newErr));
					else {

						// User created, return auth token
						return auth.generateUserToken(newUsr, function (token) {
							return res.send({
								token: token
							});
						});
					}
				});
			}
		});
	}
};

/** Google user signin
 *  Check if given Google user exists, create it if missing, and return auth token
 */
module.exports.googleSignin = function (req, res, next) {

	// Get data from request
	var id = req.body.hasOwnProperty('id') ? req.body.id : -1;
	var token = req.body.hasOwnProperty('token') ? req.body.token : -1;
	var email = req.body.hasOwnProperty('email') ? req.body.email : -1;
	var name = req.body.hasOwnProperty('name') ? req.body.name : -1;

	// Check data
	if (id === -1 || token === -1 || email === -1 || name === -1)
		return error.send('400', '1', 'warn', res, 'controllers.user.googleSignin', 'Parameter missing from call: ' + JSON.stringify(req.body));
	else {

		// Check if user already exists
		return user.getByGoogleId(id, function (checkErr, checkUsr) {
			if (checkErr)
				return error.send('500', '1', 'error', res, 'controllers.user.googleSignin', 'Error checking user: ' + JSON.stringify(checkErr));
			else if (checkUsr) {

				// Store new Google token
				return user.updateGoogleToken(id, token, function (updErr, updRes) {
					if (updErr)
						return error.send('500', '1', 'error', res, 'controllers.user.googleSignin', 'Error updating user token: ' + JSON.stringify(updErr));
					else {

						// User already exists, return auth token
						return auth.generateUserToken(checkUsr, function (token) {
							return res.send({
								token: token
							});
						});
					}
				});
			} else {

				// New user, store it
				return user.newGoogleUser(id, token, email, name, function (newErr, newUsr) {
					if (newErr)
						return error.send('500', '1', 'error', res, 'controllers.user.googleSignin', 'Error creating new user: ' + JSON.stringify(newErr));
					else {

						// User created, return auth token
						return auth.generateUserToken(newUsr, function (token) {
							return res.send({
								token: token
							});
						});
					}
				});
			}
		});
	}
};

/** Twitter user signin
 *  Check if given Twitter user exists, create it if missing, and return auth token
 */
module.exports.twitterSignin = function (req, res, next) {

	// Get data from request
	var id = req.body.hasOwnProperty('id') ? req.body.id : -1;
	var token = req.body.hasOwnProperty('token') ? req.body.token : -1;
	var username = req.body.hasOwnProperty('username') ? req.body.username : -1;
	var displayName = req.body.hasOwnProperty('displayName') ? req.body.displayName : -1;

	// Check data
	if (id === -1 || token === -1 || username === -1 || displayName === -1)
		return error.send('400', '1', 'warn', res, 'controllers.user.twitterSignin', 'Parameter missing from call: ' + JSON.stringify(req.body));
	else {

		// Check if user already exists
		return user.getByTwitterId(id, function (checkErr, checkUsr) {
			if (checkErr)
				return error.send('500', '1', 'error', res, 'controllers.user.twitterSignin', 'Error checking user: ' + JSON.stringify(checkErr));
			else if (checkUsr) {

				// Store new Twitter token
				return user.updateTwitterToken(id, token, function (updErr, updRes) {
					if (updErr)
						return error.send('500', '1', 'error', res, 'controllers.user.twitterSignin', 'Error updating user token: ' + JSON.stringify(updErr));
					else {

						// User already exists, return auth token
						return auth.generateUserToken(checkUsr, function (token) {
							return res.send({
								token: token
							});
						});
					}
				});
			} else {

				// New user, store it
				return user.newTwitterUser(id, token, username, displayName, function (newErr, newUsr) {
					if (newErr)
						return error.send('500', '1', 'error', res, 'controllers.user.twitterSignin', 'Error creating new user: ' + JSON.stringify(newErr));
					else {

						// User created, return auth token
						return auth.generateUserToken(newUsr, function (token) {
							return res.send({
								token: token
							});
						});
					}
				});
			}
		});
	}
};