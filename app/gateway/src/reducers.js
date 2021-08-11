var CombineReducers = require("redux").combineReducers;
var Actions = require("./actions/actions.js");

var InitialState = {
	header: {
		buttonPage: "signup",
		buttonText: "Log Out",
		performLogout: true,
	},
	flash: {
		level: "",
		id: undefined,
		msg: "",
	},
};

function header(state, action) {
	if (typeof state == "undefined") {
		state = InitialState.header;
	}

	switch (action.type) {
		case Actions.SET_HEADER:
			return Object.assign({}, state, {
				buttonPage: action.buttonPage,
				buttonText: action.buttonText,
				performLogout: action.performLogout,
			});
		default:
			return state;
	}
}

function flash(state, action) {
	if (typeof state == "undefined") {
		state = InitialState.flash;
	}

	switch (action.type) {
		case Actions.SET_FLASH:
			return Object.assign({}, state, {
				level: action.level,
				msg: action.msg,
				id: action.id,
			});
		default:
			return state;
	}
}

var App = CombineReducers({
	header: header,
	flash: flash,
});

module.exports = App;
