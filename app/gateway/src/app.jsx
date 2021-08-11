import "../css/main.css";
import "../css/normalize.css";
import "../assets/bread-logo-white.svg";
import "../assets/edit-icon.svg";
import "../assets/rbc-logo.svg";
import "../assets/favicon.ico";
import "../assets/no-image.gif";
import { datadogRum } from "@datadog/browser-rum";
import { datadogLogs } from "@datadog/browser-logs";
// Bootstrap App
(function () {
	var React = require("react");
	var ReactDOM = require("react-dom");
	var Router = require("react-router");
	var ReactRedux = require("react-redux");
	var Redux = require("redux");

	var CreateStore = Redux.createStore;
	var Provider = ReactRedux.Provider;
	var AppRoutes = require("./routes.jsx");
	var Reducers = require("./reducers.js");
	var Creators = require("./actions/creators.js");

	var store = CreateStore(Reducers);

	if (process.env.NODE_ENV !== "development") {
		/*
			Although keys are defined using camelCasing in values-*.yaml.gotmpl 
			and config.yaml, all keys of the window.AppConfig object will be 
			lower cased. This is the output of the Go templating library.
		*/
		const sharedOptions = {
			clientToken: window.AppConfig.datadogclienttoken,
			site: window.AppConfig.datadogsite,
			env: window.AppConfig.stage,
			service: window.AppConfig.servicename,
			sampleRate: 100,
		};

		datadogRum.init({
			...sharedOptions,
			applicationId: window.AppConfig.datadogapplicationid,
		});

		datadogLogs.init({
			...sharedOptions,
			trackInteractions: true,
		});
	}

	var Root = React.createClass({
		render: function () {
			return (
				<Provider store={store}>
					<AppRoutes />
				</Provider>
			);
		},
	});

	ReactDOM.render(<Root />, document.getElementById("container"));
})();
