var React = require("react");
var History = require("react-router").History;
var Connect = require("react-redux").connect;
var Creators = require("../actions/creators.js");

var Api = require("../api.js");
var Header = require("./header.jsx");

var ForgotPasswordForm = React.createClass({
	mixins: [History],
	componentDidMount: function () {
		var dispatch = this.props.dispatch;
		dispatch(Creators.setHeader("signin", "Sign In", false));
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var dispatch = this.props.dispatch;
		var payload = {
			email: this.refs.email.value.trim(),
		};
		if (!payload.email) {
			dispatch(Creators.setFlashError("Please enter a valid email address"));
			return;
		}
		var self = this;
		Api.postForgotPassword(payload).then(
			function (data) {
				dispatch(Creators.setFlashSuccess("Reset password email has been sent"));
				setTimeout(function () {
					self.history.pushState(null, "signin");
				}, 3000);
				return;
			},
			function (err) {
				dispatch(Creators.setFlashError("Please reload and try again"));
				return;
			},
		);
	},
	handleClick: function (e) {
		e.preventDefault();
		this.history.pushState(null, "signin");
	},
	render: function () {
		return (
			<div className="bread-header-buffer">
				<div className="subheader">
					<h3>Shopify Portal</h3>
				</div>
				<div className="signin-content">
					<h3 className="">Forgot Password</h3>
					<p>Enter your email address to receive a password recovery email.</p>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<input className="" type="text" placeholder="email" ref="email" />
						</div>
						<div className="form-group">
							<button className="form-button form-submit-button" type="submit">
								<span>Reset Password</span>
							</button>
						</div>
						<a className="form-group link" onClick={this.handleClick}>
							Back to login
						</a>
					</form>
				</div>
			</div>
		);
	},
});

module.exports = Connect(function (state) {
	return {};
})(ForgotPasswordForm);
