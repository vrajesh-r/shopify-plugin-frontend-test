var React = require("react");
var History = require("react-router").History;
var Connect = require("react-redux").connect;
var Creators = require("../actions/creators.js");

var Api = require("../api.js");
var Header = require("./header.jsx");

var SigninForm = React.createClass({
	mixins: [History],
	componentDidMount: function () {
		var dispatch = this.props.dispatch;
		dispatch(Creators.setHeader("signup", "Create Account", false));
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var payload = {
			email: this.refs.email.value.trim(),
			password: this.refs.password.value.trim(),
		};
		if (!payload.email || !payload.password) {
			// do better
			var dispatch = this.props.dispatch;
			dispatch(Creators.setFlashError("Log in information is incomplete"));
			return;
		}
		var self = this;
		Api.signIn(payload).then(
			function (data) {
				// redirect to portal
				self.history.pushState(null, "portal");
			},
			function (err) {
				// flash error
				var dispatch = self.props.dispatch;
				dispatch(Creators.setFlashError("Email/Password combination incorrect."));
			},
		);
	},
	handleClick: function (e) {
		e.preventDefault();
		this.history.pushState(null, "forgot");
	},
	render: function () {
		return (
			<div className="bread-header-buffer signin-container">
				<div className="subheader">
					<h3>Shopify Portal</h3>
				</div>
				<div className="signin-content">
					<h3 className="">Sign In</h3>
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
})(SigninForm);
