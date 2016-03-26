/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the auth-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

/* Check if user is authenticated
 */
module.exports.isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		return res.status(401).send('Unauthorized');
};

/* Send some auth information
 */
module.exports.authInfo = function (req, res, next) {
	return res.status(200).send({
		userId: req.user.id
	});
};

/* Logout
 */
module.exports.logout = function (req, res, next) {
	if (req.logout)
		req.logout();
	return res.status(200).send('OK');
};