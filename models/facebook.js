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
var request = require('request');

// Check a Facebook token validity and correspondence to user id
module.exports.checkTokenValidity = function (token, userid, callback) {

	// Call Facebook Graph endpoint to check token

	// Build URL
	var url = 'https://graph.facebook.com/debug_token?input_token=' + token + '&access_token=' + token;

	// Request options
	var options = {
		url: url,
		strictSSL: false,
		maxRedirects: 8
	};

	// Request data from Facebook Graph API
	return request(options, function (errReq, resp, body) {
		if (errReq)
			return callback(errReq);
		else if (resp.statusCode < 200 || resp.statusCode > 399)
			return callback(new Error('Bad response code from Facebook Graph API while checking token validity: ' + JSON.stringify(body)));
		else {

			// Get data from response body
			var bodyParsed = null;
			try {
				bodyParsed = JSON.parse(body);
			} catch (e) {
				return callback(new Error('Exception during body parsing of Facebook GRaph API response: ' + e));
			}

			// Check response content
			if (!bodyParsed)
				return callback(new Error('Empty response body received from Facebook GRaph API.'));
			else if (!bodyParsed.data.is_valid || bodyParsed.data.user_id !== userid)
				return callback(null, false);
			else
				return callback(null, true);
		}
	});
};