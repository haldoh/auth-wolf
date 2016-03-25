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
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var cors = require('cors');

var logger = require('./logger');
var config = require('./config');

// Express config
module.exports = function () {

	/*
	 * Express configuration
	 */

	// Create app
	var app = express();

	// Parse JSON
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// Use morgan for request logs
	app.use(morgan(config.morgan, {
		"stream": {
			write: function (message, encoding) {
				logger.info(message);
			}
		}
	}));

	// Passport references
	app.use(session({
		secret: config.sessionSecret,
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({
			url: config.mongo.uri
		})
	}));
	app.use(passport.initialize());
	app.use(passport.session());


	/*
	 * Routes
	 */

	// Enable cross-domain requests for all routes
	app.use(cors());

	// Documentation - static
	app.use('/docs', express.static('docs'));
	// Static/generic routes
	app.use('/', require('../routes/static'));
	// Users routes
	app.use('/users', require('../routes/users'));
	// Authentication routes
	app.use('/auth', require('../routes/auth'));

	/*
	 * HTTP server setup
	 */
	var server = require('http').createServer(app);
	server.listen(config.port);
	console.log("Environment: " + config.mode);
	console.log("HTTP server listening on port " + config.port);

	// Return the express app
	return app;
};