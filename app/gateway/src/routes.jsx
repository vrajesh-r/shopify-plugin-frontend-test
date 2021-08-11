// Modules & Deps
var React = require("react");
var RR = require("react-router");
var Router = RR.Router;
var Route = RR.Route;
var IndexRoute = RR.IndexRoute;
var Redirect = RR.Redirect;
var DefaultRoute = RR.DefaultRoute;
var History = RR.History;

// Components & Resources
var Api = require("./api.js");
var Master = require("./containers/master.jsx");
var Portal = require("./containers/portal.jsx");
var Signin = require("./components/signin.jsx");
var Signup = require("./components/signup.jsx");
var Forgot = require("./components/forgot.jsx");
var Reset = require("./components/reset.jsx");

var AuthWrapper = function (Type, redirectLogin) {
	return React.createClass({
		mixins: [History],
		componentDidMount: function () {
			var self = this;
			Api.isLoggedIn().then(
				function () {
					self.history.pushState(null, "portal");
				},
				function () {
					if (redirectLogin == true) {
						self.history.pushState(null, "signin");
					}
				},
			);
		},
		render: function () {
			return (
				<Type
					children={this.props.children}
					locations={this.props.locations}
					params={this.props.params}
				/>
			);
		},
	});
};

var Routes = React.createClass({
	render: function () {
		return (
			<Router>
				<Route path="/" component={Master}>
					<IndexRoute component={AuthWrapper(Signin)} />
					<Route path="signin" component={AuthWrapper(Signin)} />
					<Route path="signup" component={AuthWrapper(Signup)} />
					<Route path="portal" component={AuthWrapper(Portal, true)} />
					<Route path="forgot" component={AuthWrapper(Forgot)} />
					<Route path="reset" component={Reset} />
				</Route>
			</Router>
		);
	},
});

module.exports = Routes;
