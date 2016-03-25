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
var User = require('mongoose').model('User');

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
module.exports.newLocalUser = function (email, password, callback) {

	// Create a new user
	var newUser = new User();

	// Store data in new user
	newUser.email = email;
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

	// Save user
	newUser.save(callback);
};