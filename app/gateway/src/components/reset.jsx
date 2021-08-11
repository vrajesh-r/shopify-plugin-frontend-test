var React = require("react");
var History = require("react-router").History;
var Connect = require("react-redux").connect;
var Creators = require("../actions/creators.js");

var Api = require("../api.js");
var Header = require("./header.jsx");

var ResetPasswordForm = React.createClass({
	mixins: [History],
	getInitialState: function () {
		return {
			showForm: false,
		};
	},
	componentDidMount: function () {
		var dispatch = this.props.dispatch;
		var self = this;
		dispatch(Creators.setHeader("signin", "Sign In", false));
		var pieces = window.location.href.split("token=");
		if (!pieces[1]) {
			dispatch(Creators.setFlashError("Invalid token"));
			setTimeout(function () {
				self.redirect();
			}, 2000);
			return;
		}
		var resetToken = pieces[1].split("&_k=")[0];
		var payload = {
			resetToken: resetToken,
		};
		Api.validateResetToken(payload).then(
			function (data) {
				self.setState({
					showForm: true,
				});
			},
			function (err) {
				dispatch(Creators.setFlashError("Invalid token"));
				setTimeout(function () {
					self.redirect();
				}, 2000);
				return;
			},
		);
	},
	redirect: function () {
		this.history.pushState(null, "signin");
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var dispatch = this.props.dispatch;
		var pieces = window.location.href.split("token=")[1];
		var resetToken = pieces.split("&_k=")[0];
		var payload = {
			resetToken: resetToken,
			newPassword: this.refs.password.value.trim(),
			newPasswordVerify: this.refs.passwordVerify.value.trim(),
		};
		if (!payload.newPassword || !payload.newPasswordVerify) {
			dispatch(Creators.setFlashError("Please enter a new password"));
			return;
		}
		var self = this;
		Api.postResetPassword(payload).then(
			function (data) {
				dispatch(Creators.setFlashSuccess("Your password has been reset successfully"));
				setTimeout(function () {
					self.history.pushState(null, "signin");
				}, 3000);
				return;
			},
			function (err) {
				if (err.responseJSON.error) {
					dispatch(Creators.setFlashError(err.responseJSON.error));
				} else {
					dispatch(Creators.setFlashError("Please reload and try again"));
				}
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
				<div
					className="signin-content"
					style={{ display: this.state.showForm ? "block" : "none" }}
				>
					<h3 className="">Reset Password</h3>
					<h3>{this.state.test}</h3>
					<p>Enter your email address to receive a password recovery email.</p>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<input
								className=""
								type="password"
								placeholder="password"
								ref="password"
							/>
						</div>
						<div className="form-group">
							<input
								className=""
								type="password"
								placeholder="verify password"
								ref="passwordVerify"
							/>
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
})(ResetPasswordForm);
