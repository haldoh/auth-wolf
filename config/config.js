/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the auth-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

// Configuration object
var config = {

	// Local configuration parameters
	local: {
		mode: 'local',
		port: 3000
	},

	// Heroku configuration parameters
	heroku: {
		mode: 'heroku',
		port: process.env.port
	}
};

// Return the correct configuration parameters based on environment
module.exports = process.env.NODE_ENV ? config[process.env.NODE_ENV] : config.local;