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
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var user = require('../models/user');
var config = require('./config');

module.exports = function () {

	/* Serialize user for the session
	 */
	passport.serializeUser(function (usr, done) {
		done(null, usr.id);
	});

	/* Deserialize user
	 */
	passport.deserializeUser(function (id, done) {
		user.getById(id, done);
	});

	/* Local login
	 */
	passport.use('local-login', new LocalStrategy({

			// Define fields used to identify user
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // Pass back the entire request to the callback
		},
		function (req, email, password, done) {

			// Find the user using email
			user.getByEmail(email, function (err, usr) {
				
				// An error occurred
				if (err)
					return done(err);

				// No user found
				if (!user)
					return done(null, false);

				// User found but wrong password
				if (!user.checkPassword(usr, password))
					return done(null, false);

				// Login successfull
				return done(null, usr);
			});

		}));


	/* Local signup
	 */
	passport.use('local-signup', new LocalStrategy({

			// Define fields used to identify user
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // Pass back the entire request to the callback
		},
		function (req, email, password, done) {

			// Check if user's email is already in the DB
			user.getByEmail(email, function (err, usr) {

				// An error occurred
				if (err)
					return done(err);

				// A user was found, signup failed
				if (usr)
					return done(null, false);

				// Store new user
				else
					user.newLocalUser(email, password, done);

			});
		}));

	/* Google auth
	 */
	passport.use(new GoogleStrategy({

			// Application credentials
			clientID: config.googleAuth.clientID,
			clientSecret: config.googleAuth.clientSecret,
			callbackURL: config.googleAuth.callbackURL,
		},

		// Google sends back the token and profile
		function (token, refreshToken, profile, done) {

			// Check if the Google ID is already in the DB
			user.getByGoogleId(profile.id, function (err, usr) {

				// An error occurred
				if (err)
					return done(err);

				// A user was found, log in
				if (usr)
					return done(null, usr);

				// Store new user
				else {
					var email = profile.emails && 0 in profile.emails ? profile.emails[0].value : null;
					user.newGoogleUser(profile.id, token, email, profile.displayName, done);
				}
			});
		}));

	/* Facebook auth
	 */
	passport.use(new FacebookStrategy({

			// Application credentials
			clientID: config.facebookAuth.clientID,
			clientSecret: config.facebookAuth.clientSecret
		},

		// Facebook sends back the token and profile
		function (token, refreshToken, profile, done) {

			// Check if the Google ID is already in the DB
			user.getByFacebookId(profile.id, function (err, usr) {

				// An error occurred
				if (err)
					return done(err);

				// A user was found, log in
				if (usr)
					return done(null, usr);

				// Store new user
				else {
					var email = profile.emails && 0 in profile.emails ? profile.emails[0].value : null;
					user.newFacebookUser(profile.id, token, email, profile.displayName, done);
				}
			});
		}));

	/* Twitter auth
	 */
	passport.use(new TwitterStrategy({

			// Application credentials
			consumerKey: config.twitterAuth.consumerKey,
			consumerSecret: config.twitterAuth.consumerSecret,
			callbackURL: config.twitterAuth.callbackURL
		},

		// Twitter sends back the token and profile
		function (token, tokenSecret, profile, done) {

			// Check if the twitter ID is already in the DB
			user.getByTwitterId(profile.id, function (err, usr) {

				// An error occurred
				if (err)
					return done(err);

				// A user was found, log in
				if (usr)
					return done(null, usr);

				// Store new user
				else
					user.newTwitterUser(profile.id, token, profile.displayName, profile.userName, done);
			});
		}));
};