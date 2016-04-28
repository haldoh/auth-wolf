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

var User = require('mongoose').model('User');

var config = require('../config/config');

// Get a user based on its ID
module.exports.getById = function (id, callback) {
	User.findById(id, callback);
};

// Get a user based on its email
module.exports.getByEmail = function (email, callback) {
	User.findOne({
		email: email
	}, callback);
};

// Check a user's password
module.exports.checkPassword = function (user, password) {
	return user.validPassword(password);
};

// Get a user based on its Facebook ID
module.exports.getByFacebookId = function (id, callback) {
	User.findOne({
		'facebook.id': id
	}, callback);
};

// Get a user based on its Google ID
module.exports.getByGoogleId = function (id, callback) {
	User.findOne({
		'google.id': id
	}, callback);
};

// Get a user based on its Twitter ID
module.exports.getByTwitterId = function (id, callback) {
	User.findOne({
		'twitter.id': id
	}, callback);
};

// Store a new user after local signup
module.exports.newLocalUser = function (email, password, displayName, callback) {

	// Create a new user
	var newUser = new User();

	// Store data in new user
	newUser.email = email;
	newUser.displayName = displayName ? displayName : email.split('@')[0];
	newUser.password = newUser.generateHash(password);

	// Save user
	newUser.save(callback);
};

// Store a new user after Facebook signup
module.exports.newFacebookUser = function (id, token, email, name, callback) {

	// Create a new user
	var newUser = new User();

	// Store data in new user
	newUser.facebook = {};
	newUser.facebook.id = id;
	newUser.facebook.token = token;
	newUser.facebook.email = email;
	newUser.facebook.name = name;
	newUser.displayName = name;

	// Save user
	newUser.save(callback);
};

// Store a new user after Google signup
module.exports.newGoogleUser = function (id, token, email, name, callback) {

	// Create a new user
	var newUser = new User();

	// Store data in new user
	newUser.google = {};
	newUser.google.id = id;
	newUser.google.token = token;
	newUser.google.email = email;
	newUser.google.name = name;
	newUser.displayName = name;

	// Save user
	newUser.save(callback);
};

// Store a new user after Twitter signup
module.exports.newTwitterUser = function (id, token, displayName, username, callback) {

	// Create a new user
	var newUser = new User();

	// Store data in new user
	newUser.twitter = {};
	newUser.twitter.id = id;
	newUser.twitter.token = token;
	newUser.twitter.displayName = displayName;
	newUser.twitter.username = username;
	newUser.displayName = displayName;

	// Save user
	newUser.save(callback);
};

// Update Facebook token
module.exports.updateFacebookToken = function (id, token, callback) {

	// Search parameters
	var search = {
		'facebook.id': id
	};

	// Update parameters
	var update= {
		$set: {
			'facebook.token': token
		}
	};

	// Options
	var options = {};

	// Update
	User.update(search, update, options).exec(callback);
};

// Update Google token
module.exports.updateGoogleToken = function (id, token, callback) {

	// Search parameters
	var search = {
		'google.id': id
	};

	// Update parameters
	var update= {
		$set: {
			'google.token': token
		}
	};

	// Options
	var options = {};

	// Update
	User.update(search, update, options).exec(callback);
};

// Update Twitter token
module.exports.updateTwitterToken = function (id, token, callback) {

	// Search parameters
	var search = {
		'twitter.id': id
	};

	// Update parameters
	var update= {
		$set: {
			'twitter.token': token
		}
	};

	// Options
	var options = {};

	// Update
	User.update(search, update, options).exec(callback);
};