var $ = require("jquery");
var Q = require("q");
const api_url = (window.AppConfig && window.AppConfig.apiurl) || "";
var api = {};

var logger = require("./utils/logging");

api.isLoggedIn = function () {
	var deferred = Q.defer();
	return $.ajax({
		url: api_url + "/gateway/session",
		xhrFields: {
			withCredentials: true,
		},
		type: "GET",
		dataType: "json",
		contentType: "application/json",
	}).then(
		function () {
			deferred.resolve(true);
		},
		function () {
			deferred.resolve(false);
		},
	);
	return deferred.promise;
};

api.signIn = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		url: api_url + "/gateway/signin",
		xhrFields: {
			withCredentials: true,
		},
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		}.bind(this),
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.signUp = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		url: api_url + "/gateway/signup",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		xhrFields: {
			withCredentials: true,
		},
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr, err);
		},
	});
	return deferred.promise;
};

api.logOut = function () {
	var deferred = Q.defer();
	$.ajax({
		type: "GET",
		url: api_url + "/gateway/logout",
		dataType: "json",
		xhrFields: {
			withCredentials: true,
		},
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			deferred.resolve();
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.updateGatewayVersion = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		url: api_url + "/gateway/account/version",
		dataType: "json",
		xhrFields: {
			withCredentials: true,
		},
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.updateGatewayCredentials = function () {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		url: api_url + "/gateway/account/credentials",
		xhrFields: {
			withCredentials: true,
		},
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.getAccountSettings = function () {
	var deferred = Q.defer();
	$.ajax({
		type: "GET",
		url: api_url + "/gateway/account",
		xhrFields: {
			withCredentials: true,
		},
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.updateBreadSettings = function (payload, breadVersion) {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		url: api_url + "/gateway/account/" + breadVersion,
		dataType: "json",
		xhrFields: {
			withCredentials: true,
		},
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.updateAccountSettings = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		url: api_url + "/gateway/account/password",
		xhrFields: {
			withCredentials: true,
		},
		dataType: "json",
		contentType: "application/json charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.postForgotPassword = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		xhrFields: {
			withCredentials: true,
		},
		url: api_url + "/gateway/account/password/forgot",
		dataType: "json",
		contentType: "application/json charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.postResetPassword = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		type: "POST",
		xhrFields: {
			withCredentials: true,
		},
		url: api_url + "/gateway/account/password/reset",
		dataType: "json",
		contentType: "application/json charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr, err);
		},
	});
	return deferred.promise;
};

api.validateResetToken = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		xhrFields: {
			withCredentials: true,
		},
		type: "POST",
		url: api_url + "/gateway/account/password/reset/validate",
		dataType: "json",
		contentType: "application/json charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};

api.getTenant = function (payload) {
	var deferred = Q.defer();
	$.ajax({
		type: "GET",
		url: api_url + "/gateway/tenant",
		dataType: "json",
		contentType: "application/json charset=utf-8",
		data: JSON.stringify(payload),
		success: function (data) {
			deferred.resolve(data);
		},
		error: function (xhr, status, err) {
			logger.datadogLog("error", err, status);
			deferred.reject(xhr.status, err);
		},
	});
	return deferred.promise;
};
module.exports = api;
