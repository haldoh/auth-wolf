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
	req.successRedirect = refUrl ? decodeURIComponent(refUrl) : '/users/me';

	passport.authenticate('facebook', {
		callbackURL: callbackURL,
		failureRedirect: '/fail'
	})(req, res, next);
};

/* Google auth
 */
module.exports.googleAuth = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// Get base callback URL
	var callbackURL = config.googleAuth.callbackURL;

	// Attach ref for later redirect if provided
	if (refUrl)
		callbackURL += '?refUrl=' + refUrl;

	logger.debug('Google auth callback URL: ' + callbackURL);

	// Call passport authentication strategy
	return passport.authenticate('google', {
		scope: ['profile', 'email'],
		callbackURL: callbackURL
	})(req, res, next);
};

/* Google callback
 */
module.exports.googleAuthCallback = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// Get base callback URL
	var callbackURL = config.googleAuth.callbackURL;

	// Attach ref for later redirect if provided
	if (refUrl)
		callbackURL += '?refUrl=' + refUrl;

	logger.debug('Google callback auth callback URL: ' + callbackURL);

	// If a ref URL was given, redirect to it, otherwise redirect to user data
	var successRedirect = refUrl ? decodeURIComponent(refUrl) : '/users/me';

	passport.authenticate('google', {
		callbackURL: callbackURL,
		successRedirect: successRedirect,
		failureRedirect: '/fail'
	})(req, res, next);
};

/* Twitter auth
 */
module.exports.twitterAuth = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// Get base callback URL
	var callbackURL = config.twitterAuth.callbackURL;

	// Attach ref for later redirect if provided
	if (refUrl)
		callbackURL += '?refUrl=' + refUrl;

	logger.debug('Twitter auth callback URL: ' + callbackURL);

	// Call passport authentication strategy
	return passport.authenticate('twitter', {
		callbackURL: callbackURL
	})(req, res, next);
};

/* Twitter callback
 */
module.exports.twitterAuthCallback = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// Get base callback URL
	var callbackURL = config.twitterAuth.callbackURL;

	// Attach ref for later redirect if provided
	if (refUrl)
		callbackURL += '?refUrl=' + refUrl;

	logger.debug('Twitter callback auth callback URL: ' + callbackURL);

	// If a ref URL was given, redirect to it, otherwise redirect to user data
	var successRedirect = refUrl ? decodeURIComponent(refUrl) : '/users/me';

	passport.authenticate('twitter', {
		callbackURL: callbackURL,
		successRedirect: successRedirect,
		failureRedirect: '/fail'
	})(req, res, next);
};

/* Redirection after external auth
 */
module.exports.loggedRedirect = function (req, res, next) {

	// Get logged user
	var usr = req.user.toObject();
	
	// Remove sensitive information
	delete usr.password;

	// Set header
	res.header('x-wolf-user', JSON.stringify(usr));

	// Redirect
	res.redirect(req.successRedirect);
};

/* Logout
 */
module.exports.logout = function (req, res, next) {
	if (req.logout)
		req.logout();
	return res.status(200).send('OK');
};