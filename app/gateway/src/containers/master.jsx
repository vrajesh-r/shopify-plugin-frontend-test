var React = require("react");
var History = require("react-router").History;
var Connect = require("react-redux").connect;

var Header = require("../components/header.jsx");
var Api = require("../api.js");

var Master = React.createClass({
	mixins: [History],
	getInitialState: function () {
		return {};
	},
	render: function () {
		return (
			<span>
				<Header
					buttonPage={this.props.buttonPage}
					buttonText={this.props.buttonText}
					performLogout={this.props.performLogout}
					flash={this.props.flash}
				/>
				{this.props.children}
			</span>
		);
	},
});

module.exports = Connect(function (state) {
	return {
		buttonPage: state.header.buttonPage,
		buttonText: state.header.buttonText,
		performLogout: state.header.performLogout,
		flash: state.flash,
	};
})(Master);
