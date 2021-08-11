var React = require("react");
var Connect = require("react-redux").connect;
var Creators = require("../actions/creators.js");
var History = require("react-router").History;

var Components = require("../components/portal.jsx");
var BreadVersionSection = Components.BreadVersionSection;
var GatewayCredentialsSection = Components.GatewayCredentialsSection;
var BreadSettingsSection = Components.BreadSettingsSection;
var BreadPlatformSettingsSection = Components.BreadPlatformSettingsSection;
var AccountSection = Components.AccountSection;
var Api = require("../api.js");
var Classic = "classic";

var account = {
	gatewayKey: "",
	gatewaySecret: "",
	apiKey: "",
	sharedSecret: "",
	sandboxApiKey: "",
	sandboxSharedSecret: "",
	autoSettle: false,
	healthcareMode: false,
	targetedFinancing: false,
	targetedFinancingID: "",
	targetedFinancingThreshold: "",
	plusEmbeddedCheckout: false,
	production: false,
	remainderPayAutoCancel: false,
	activeVersion: "",
};

var Portal = React.createClass({
	mixins: [History],
	getInitialState: function () {
		return {
			account: account,
			tempVersion: Classic,
		};
	},
	componentDidMount: function () {
		var dispatch = this.props.dispatch;
		dispatch(Creators.setHeader("signin", "Log Out", true));
		var self = this;
		Api.getAccountSettings().then(
			function (account) {
				self.setState({
					account: account,
					tempVersion: account.activeVersion == "" ? Classic : account.activeVersion,
				});
			},
			function (status, err) {
				if (status == 401) {
					return self.history.pushState(null, "signin");
				}
				// flash error
				self.props.flashError("Settings not found, please refresh");
			},
		);
	},
	flashError: function (msg) {
		this.props.dispatch(Creators.setFlashError(msg));
	},
	flashSuccess: function (msg) {
		this.props.dispatch(Creators.setFlashSuccess(msg));
	},
	handleVersionChange: function (version) {
		this.setState({
			tempVersion: version,
		});
	},
	handleVersionUpdate: function (e, version) {
		e.preventDefault();
		var self = this;
		Api.updateGatewayVersion({ activeVersion: version }).then(
			function (data) {
				self.setState({
					account: Object.assign({}, self.state.account, { activeVersion: version }),
				});
				self.flashSuccess("Success!");
			},
			function (status, err) {
				if (status == 401) {
					return self.history.pushState(null, "signin");
				}
				// flash error
				self.flashError("Unable to complete request, please refresh and try again");
			},
		);
	},
	handleGatewayCredentialsUpdate: function (e) {
		e.preventDefault();
		var update = confirm(
			"Refreshing gateway credentials will invalidate existing gateway credentials, and will require an update to Bread gateway settings in Shopify. Are you sure you would like to continue",
		);
		if (!update) return;
		var self = this;
		Api.updateGatewayCredentials().then(
			function (data) {
				var updatedAccount = Object.assign({}, this.state.account, {
					gatewayKey: data.gatewayKey,
					gatewaySecret: data.gatewaySecret,
				});
				self.setState({
					account: updatedAccount,
				});
			},
			function (status, err) {
				if (status == 401) {
					return self.history.pushState(null, "signin");
				}
				// flash error
				self.flashError("Unable to complete request, please refresh and try again");
			},
		);
	},
	handleBreadSettingsUpdate: function () {
		var self = this;

		return Api.updateBreadSettings(accountSettings).then(
			function (data) {
				self.flashSuccess("Success!");
			},
			function (status, err) {
				if (status == 401) {
					return self.history.pushState(null, "signin");
				}
				// flash error
				self.props.flashError("Update was unsuccessful, please try again.");
			},
		);
	},
	getCheckedVersionOptions: function (version) {
		var vOptions = JSON.parse(JSON.stringify(versionOptions));
		var vOption = vOptions.find(function (vOption) {
			// find option to be checked
			return vOption.value === version;
		});
		if (vOption) {
			var idx = vOptions.indexOf(vOption);
			vOptions[idx].checked = true;
		}
		return vOptions;
	},
	shouldShowContent: function () {
		var showContent = false;
		this.state.versionOptions.forEach(function (vOption) {
			if (vOption.checked) showContent = true;
		});

		return showContent;
	},
	getContent: function () {
		var gatewayCredentials = {
			gatewayKey: this.state.account.gatewayKey,
			gatewaySecret: this.state.account.gatewaySecret,
		};

		return this.state.tempVersion === Classic ? (
			<span>
				<BreadVersionSection
					version={this.state.tempVersion}
					onChange={this.handleVersionChange}
					onSubmit={this.handleVersionUpdate}
				/>
				<GatewayCredentialsSection
					flashSuccess={this.flashSuccess}
					flashError={this.flashError}
					onUpdate={this.handleGatewayCredentialsUpdate}
					credentials={gatewayCredentials}
				/>
				<BreadSettingsSection
					flashSuccess={this.flashSuccess}
					flashError={this.flashError}
				/>
				<AccountSection flashSuccess={this.flashSuccess} flashError={this.flashError} />
			</span>
		) : (
			<span>
				<BreadVersionSection
					version={this.state.tempVersion}
					onChange={this.handleVersionChange}
					onSubmit={this.handleVersionUpdate}
				/>
				<GatewayCredentialsSection
					flashSuccess={this.flashSuccess}
					flashError={this.flashError}
					onUpdate={this.handleGatewayCredentialsUpdate}
					credentials={gatewayCredentials}
				/>
				<BreadPlatformSettingsSection
					flashSuccess={this.flashSuccess}
					flashError={this.flashError}
				/>
				<AccountSection flashSuccess={this.flashSuccess} flashError={this.flashError} />
			</span>
		);
	},

	render: function () {
		return <div>{this.getContent()}</div>;
	},
});

module.exports = Connect(function (state) {
	return {};
})(Portal);
