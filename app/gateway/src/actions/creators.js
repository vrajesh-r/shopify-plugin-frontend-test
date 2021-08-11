var Actions = require("./actions");

var Creators = {};

Creators.setHeader = function (buttonPage, buttonText, performLogout) {
	return {
		type: Actions.SET_HEADER,
		buttonPage: buttonPage,
		buttonText: buttonText,
		performLogout: performLogout ? performLogout : false,
	};
};

Creators.setFlashSuccess = function (msg) {
	return {
		type: Actions.SET_FLASH,
		level: "SUCCESS",
		msg: msg,
		id: Date.now(),
	};
};

Creators.setFlashError = function (msg) {
	return {
		type: Actions.SET_FLASH,
		level: "ERROR",
		msg: msg,
		id: Date.now(),
	};
};

module.exports = Creators;
