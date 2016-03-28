/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the auth-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

var endpoint = {
	heroku: 'https://auth-wolf.herokuapp.com'
};

// Configuration object
var config = {

	// Local configuration parameters
	local: {
		mode: 'local',
		port: 3000,
		sessionSecret: 'localSessionSecret',
		morgan: 'REQ :remote-addr - :remote-user  ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time',
		mongo: {
			uri: 'mongodb://localhost:27017/auth'
		},
		googleAuth: {
			clientID: 'process.env.GOOGLE_CLIENT_ID',
			clientSecret: 'process.env.GOOGLE_CLIENT_SECRET',
			callbackURL: '/auth/google/callback'
		},
		facebookAuth: {
			clientID: '1164717263579046',
			clientSecret: 'c42f6d29e918e065f9c5ff8c4f4fd3ae',
			callbackURL: '/auth/facebook/callback/'
		},
		twitterAuth: {
			consumerKey: 'process.env.TWITTER_CONSUMER_KEY',
			consumerSecret: 'process.env.TWITTER_CONSUMER_SECRET',
			callbackURL: '/auth/twitter/callback'
		}
	},

	// Heroku configuration parameters
	heroku: {
		mode: 'heroku',
		endpoint: endpoint.heroku,
		port: process.env.PORT,
		sessionSecret: process.env.SESSION_SECRET,
		morgan: 'REQ :remote-addr - :remote-user  ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time',
		mongo: {
			uri: process.env.MONGOLAB_URI
		},
		googleAuth: {
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: endpoint.heroku + '/auth/google/callback'
		},
		facebookAuth: {
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: endpoint.heroku + '/auth/facebook/callback'
		},
		twitterAuth: {
			consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			callbackURL: endpoint.heroku + '/auth/twitter/callback'
		}
	}
};

// Return the correct configuration parameters based on environment
module.exports = process.env.NODE_ENV ? config[process.env.NODE_ENV] : config.local;