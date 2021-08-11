var React = require("react");
var History = require("react-router").History;
var Connect = require("react-redux").connect;
var Creators = require("../actions/creators.js");

var Api = require("../api.js");
var Header = require("./header.jsx");

var SignupForm = React.createClass({
	mixins: [History],
	componentDidMount: function () {
		var dispatch = this.props.dispatch;
		dispatch(Creators.setHeader("signin", "Sign In", false));
	},
	handleSubmit: function (e) {
		e.preventDefault();

		// dispatch test

		var payload = {
			email: this.refs.email.value.trim(),
			password: this.refs.password.value.trim(),
			passwordVerify: this.refs.passwordVerify.value.trim(),
		};
		if (!payload.email || !payload.password || !payload.passwordVerify) {
			// do better
			return;
		}
		var self = this;
		Api.signUp(payload).then(
			function (data) {
				// redirect to portal
				self.history.pushState(null, "portal");
			},
			function (err) {
				var dispatch = self.props.dispatch;
				if (err.responseJSON.error) {
					dispatch(Creators.setFlashError(err.responseJSON.error));
				} else {
					dispatch(
						Creators.setFlashError(
							"Unable to complete sign up. Ensure information is correct.",
						),
					);
				}
			},
		);
	},
	handleClick: function (e) {
		e.preventDefault();
		this.history.pushState(null, "forgot");
	},
	render: function () {
		return (
			<div className="bread-header-buffer">
				<div className="subheader">
					<h3>Shopify Portal</h3>
				</div>
				<div className="signin-content">
					<h3 className="">Create Account</h3>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<input className="" type="text" placeholder="email" ref="email" />
						</div>
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
								<span>Submit</span>
							</button>
						</div>
						<a className="form-group link" onClick={this.handleClick}>
							Forgot password?
						</a>
					</form>
				</div>
			</div>
		);
	},
});

module.exports = Connect(function (state) {
	return {};
})(SignupForm);
