/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the auth-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

module.exports.loggedUserData = function (req, res, next) {

	// Get logged user
	var usr = req.user.toObject();
	
	// Remove sensitive information
	delete usr.password;

	// Return
	return res.status(200).send(usr);
};