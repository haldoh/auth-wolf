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
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');

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

	// Passport references
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