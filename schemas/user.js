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
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Schema for a user
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String
	},
	facebook: {
		id: {
			type: String,
			index: true
		},
		token: {
			type: String
		},
		email: {
			type: String
		},
		name: {
			type: String
		}
	},
	twitter: {
		id: {
			type: String,
			index: true
		},
		token: {
			type: String
		},
		displayName: {
			type: String
		},
		username: {
			type: String
		}
	},
	google: {
		id: {
			type: String,
			index: true
		},
		token: {
			type: String
		},
		email: {
			type: String
		},
		name: {
			type: String
		}
	}
});

// Generate a password hash using bcrypt
UserSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check password hash using bcrypt
UserSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);

module.exports.schema = UserSchema;