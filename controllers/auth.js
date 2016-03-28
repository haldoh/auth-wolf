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
var passport = require('passport');

var config = require('../config/config');
var logger = require('../config/logger');

/* Check if user is authenticated
 */
module.exports.isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		return res.status(401).send('Unauthorized');
};

/* Send some auth information
 */
module.exports.authInfo = function (req, res, next) {
	return res.status(200).send({
		userId: req.user.id
	});
};

/* Facebook auth
 */
module.exports.facebookAuth = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// Get base callback URL
	var callbackURL = config.facebookAuth.callbackURL;

	// Attach ref for later redirect if provided
	if (refUrl)
		callbackURL += '?refUrl=' + refUrl;

	logger.debug('Facebook auth callback URL: ' + callbackURL);

	// Call passport authentication strategy
	return passport.authenticate('facebook', {
		scope: 'email',
		callbackURL: callbackURL
	})(req, res, next);
};

/* Facebook callback
 */
module.exports.facebookAuthCallback = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// Get base callback URL
	var callbackURL = config.facebookAuth.callbackURL;

	// Attach ref for later redirect if provided
	if (refUrl)
		callbackURL += '?refUrl=' + refUrl;

	logger.debug('Facebook callback auth callback URL: ' + callbackURL);

	// If a ref URL was given, redirect to it, otherwise redirect to user data
	var successRedirect = refUrl ? decodeURIComponent(refUrl) : '/users/me';

	passport.authenticate('facebook', {
		callbackURL: callbackURL,
		successRedirect: successRedirect,
		failureRedirect: '/fail'
	})(req, res, next);
};

/* Logout
 */
module.exports.logout = function (req, res, next) {
	if (req.logout)
		req.logout();
	return res.status(200).send('OK');
};