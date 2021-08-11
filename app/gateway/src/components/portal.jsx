var React = require("react");
var History = require("react-router").History;

var Api = require("../api.js");
var Header = require("./header.jsx");
var branding = require("../utils/branding.js");
var CheckboxInput = require("./CheckboxInput.jsx");
var TextInput = require("./TextInput.jsx");
var RadioInput = require("./RadioInput.jsx");
var Classic = "classic";
var Platform = "platform";

function debounce(fn, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) fn.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) fn.apply(context, args);
	};
}

// BreadVersionSection allows a user select between classic and platform versions
exports.BreadVersionSection = React.createClass({
	mixins: [History],

	getInitialState: function () {
		return {
			gatewayKey: "",
			gatewaySecret: "",
		};
	},

	/*componentDidMount: function() {
		var self = this;
		Api.getAccountSettings().then(function (data) {
			self.setState({
				gatewayKey: data.gatewayKey,
				gatewaySecret: data.gatewaySecret
			});
		}, function (status, err) {
			if (status == 401) {
				return self.history.pushState(null, 'signin');
			}
			// flash error
			self.props.flashError('Settings not found, please refresh');
		});
	},*/
	getVersionOptions: function (version) {
		var versionOptions = [
			{
				id: "classic",
				name: "version",
				value: Classic,
				label: "Classic",
				disabled: false,
				checked: false,
			},
			{
				id: "platform",
				name: "version",
				value: Platform,
				label: "Bread 2.0",
				diasbled: false,
				checked: false,
			},
		];
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

	handleSubmit: function (e) {
		this.props.onUpdate(e);
	},
	onChange: function (e) {
		this.props.onChange(e.target.value);
	},
	onSubmit: function (e) {
		this.props.onSubmit(e, this.props.version);
	},
	render: function () {
		return (
			<div className="bread-header-buffer section-wrapper">
				<h3 className="section-heading color-primary">Bread Version</h3>
				<div className="info">
					<p className="margin-bottom-small">Select Bread version</p>
				</div>

				<div>
					<form onSubmit={this.onSubmit}>
						<RadioInput
							options={this.getVersionOptions(this.props.version)}
							onChange={this.onChange}
						/>
						<div className="form-group-portal">
							<br />
							<button
								className="form-button form-portal-button"
								type="submit"
								value="Select"
							>
								<span>Set as Default</span>
							</button>{" "}
							<br />
						</div>
					</form>
				</div>
			</div>
		);
	},
});

// GatewayCredentialsSection allows a user to read their Gateway credentials and refresh their Gateway credentials
exports.GatewayCredentialsSection = React.createClass({
	mixins: [History],

	getInitialState: function () {
		return {
			gatewayKey: "",
			gatewaySecret: "",
			tenant: this.props.tenant,
		};
	},
	componentWillReceiveProps: function () {
		var self = this;
		Api.getTenant().then(function (data) {
			self.setState({
				tenant: data.tenant,
			});
		});
	},
	componentDidMount: function () {
		var self = this;
		Api.getAccountSettings().then(
			function (data) {
				self.setState({
					gatewayKey: data.gatewayKey,
					gatewaySecret: data.gatewaySecret,
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
	handleSubmit: function (e) {
		this.props.onUpdate(e);
	},

	/*handleSubmit: function(e) {
		e.preventDefault();
		var tenant = this.state.tenant;
		var update = confirm(`Refreshing gateway credentials will invalidate existing gateway credentials, and will require an update to ${tenant} gateway settings in Shopify. Are you sure you would like to continue`);
		if (!update) return;
		var self = this;
		Api.updateGatewayCredentials().then(function (data) {
			self.setState({
				gatewayKey: data.gatewayKey,
				gatewaySecret: data.gatewaySecret
			});
		}, function (status, err) {
			if (status == 401) {
				return self.history.pushState(null, 'signin');
			}
			// flash error
			self.props.flashError('Unable to complete request, please refresh and try again');
		});
	},*/
	render: function () {
		let self = this;
		let tenant = self.state.tenant;
		let tenant_links = branding.selectDocumentationLinks(tenant);
		return (
			<div className="bread-header-buffer section-wrapper">
				<h3 className="section-heading color-primary">Gateway Credentials</h3>
				<div className="info">
					<p className="margin-bottom-small">
						Enter gateway keys in Shopify to link your {tenant} gateway account
					</p>
					<div className="learn-more">
						<a
							className="color-primary"
							href={tenant_links.install_instructions}
							target="_blank"
						>
							Learn more
						</a>
					</div>
				</div>
				<div>
					<span className="emphasis">Gateway Key</span>:{" "}
					{this.props.credentials.gatewayKey}
				</div>
				<div>
					<span className="emphasis">Gateway Secret</span>:{" "}
					{this.props.credentials.gatewaySecret}
				</div>
				<div>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group-portal">
							<br />
							<button
								className="form-button form-portal-button warn"
								type="submit"
								value="Refresh"
							>
								<span>Reset keys</span>
							</button>{" "}
							<br />
						</div>
					</form>
				</div>
			</div>
		);
	},
});

// BreadSettingsSection allows a user to see their Bread credentials
exports.BreadSettingsSection = React.createClass({
	mixins: [History],
	getInitialState: function () {
		return {
			account: {
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
			},
			initial: {
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
			},
			formChanged: false,
			tenant: this.props.tenant,
		};
	},

	componentDidMount: function () {
		this.compareSettings = debounce(this.compareSettings, 250);
		var self = this;
		Api.getAccountSettings().then(
			function (data) {
				data.targetedFinancingThreshold += "";
				var acc = {
					apiKey: data.apiKey,
					sharedSecret: data.sharedSecret,
					sandboxApiKey: data.sandboxApiKey,
					sandboxSharedSecret: data.sandboxSharedSecret,
					autoSettle: data.autoSettle,
					healthcareMode: data.healthcareMode,
					targetedFinancing: data.targetedFinancing,
					targetedFinancingID: data.targetedFinancingID,
					targetedFinancingThreshold: data.targetedFinancingThreshold,
					plusEmbeddedCheckout: data.plusEmbeddedCheckout,
					production: data.production,
					remainderPayAutoCancel: data.remainderPayAutoCancel,
				};
				self.setState({
					account: acc,
					initial: acc,
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

	handleChange: function (e) {
		var name = e.target.name;
		var value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		this.setState(function (state) {
			var account = Object.assign({}, state.account);
			account[name] = value;
			return {
				account: account,
			};
		}, this.compareSettings);
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var self = this;
		var accountSettings = this.getFormattedAccount();
		var valid = this.validateAccountData(accountSettings);
		if (valid !== true) {
			self.props.flashError(valid);
			return;
		}

		Api.updateBreadSettings(accountSettings, "classic").then(
			function (data) {
				self.props.flashSuccess("Success!");
				self.setState({
					account: accountSettings,
					initial: accountSettings,
					formChanged: false,
				});
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

	clearChanges: function (e) {
		e.preventDefault();
		var account = Object.assign({}, this.state.initial);
		this.setState(
			{
				account: account,
				formChanged: false,
			},
			function () {
				this.props.flashSuccess("Changes reverted");
			}.bind(this),
		);
	},

	compareSettings: function () {
		var account = this.state.account;
		var initial = this.state.initial;
		for (var prop in account) {
			if (account[prop] !== initial[prop]) {
				this.setState({ formChanged: true });
				return;
			}
		}
		this.setState({ formChanged: false });
	},

	getFormattedAccount: function () {
		var formattedAccount = {};
		var account = this.state.account;

		for (var prop in account) {
			if (typeof account[prop] === "string") {
				formattedAccount[prop] = account[prop].trim();
				if (prop === "targetedFinancingThreshold") {
					formattedAccount[prop] = parseInt(account[prop]);
				}
			} else {
				formattedAccount[prop] = account[prop];
			}
		}
		return formattedAccount;
	},

	validateAccountData: function (account) {
		var {
			apiKey,
			sharedSecret,
			sandboxApiKey,
			sandboxSharedSecret,
			gatewayKey,
			gatewaySecret,
			targetedFinancing,
			targetedFinancingID,
			targetedFinancingThreshold,
		} = account;

		var UUIDValidator = RegExp(
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
		);

		var validBreadKeys = [apiKey, sharedSecret, sandboxApiKey, sandboxSharedSecret].every(
			function (key) {
				return (
					key === "" ||
					key.includes("********-****-****-****-*****") ||
					UUIDValidator.test(key)
				);
			},
		);

		if (!validBreadKeys) {
			return "Please enter valid API and secret keys";
		}

		if (apiKey === gatewayKey || sandboxApiKey === gatewayKey) {
			return "Live and Sandbox API Keys should not be the same as the Gateway Key";
		}

		if (apiKey === gatewaySecret || sandboxApiKey === gatewaySecret) {
			return "Live and Sandbox API Keys should not be the same as the Gateway Secret";
		}

		if (sharedSecret === gatewayKey || sandboxSharedSecret === gatewayKey) {
			return "Live and Sandbox Secret Keys should not be the same as the Gateway Key";
		}

		if (sharedSecret === gatewaySecret || sandboxSharedSecret === gatewaySecret) {
			return "Live and Sandbox Secret Keys should not be the same as the Gateway Secret";
		}

		if (targetedFinancing && !UUIDValidator.test(targetedFinancingID)) {
			return "Please enter a valid financing program ID";
		}
		if (isNaN(targetedFinancingThreshold)) {
			return "Cart size threshold must be an integer";
		}
		if (targetedFinancingThreshold < 0) {
			return "Cart size threshold must be 0 or greater";
		}
		return true;
	},
	render: function () {
		let tenant = this.state.tenant;

		let tenant_links = branding.selectDocumentationLinks(tenant);
		var account = this.state.account;
		var embeddedCheckoutDisabled = !account.plusEmbeddedCheckout;
		var targetedFinancingDisabled = !account.targetedFinancing;

		return (
			<div className="section-wrapper">
				<h3 className="section-heading color-primary">{tenant} Authentication</h3>
				<div className="info">
					<p className="margin-bottom-small">
						Enter {tenant} API keys to connect your {tenant} merchant portal to your
						gateway account
					</p>
					<div className="learn-more">
						<a
							className="color-primary"
							href={tenant_links.gateway_instructions}
							target="_blank"
						>
							Learn more
						</a>
					</div>
				</div>
				<form onSubmit={this.handleSubmit}>
					<TextInput
						title="Live API Key"
						id="live-api-key"
						name="apiKey"
						value={account.apiKey}
						onChange={this.handleChange}
						hint={
							<span className="hint float-right">
								Find live keys in{" "}
								<a href={tenant_links.merchant_portal} target="_blank">
									{tenant_links.merchant_portal_clipped}
								</a>
							</span>
						}
					/>
					<TextInput
						title="Live Secret Key"
						id="live-secret-key"
						name="sharedSecret"
						value={account.sharedSecret}
						onChange={this.handleChange}
					/>
					<br />
					<TextInput
						title="Sandbox API Key"
						id="sandbox-api-key"
						name="sandboxApiKey"
						value={account.sandboxApiKey}
						onChange={this.handleChange}
						hint={
							<span className="hint float-right">
								Find sandbox keys in{" "}
								<a href={tenant_links.merchant_portal_sandbox} target="_blank">
									{tenant_links.merchant_portal_sandbox_clipped}
								</a>
							</span>
						}
					/>
					<TextInput
						title="Sandbox Secret Key"
						id="sandbox-secret-key"
						name="sandboxSharedSecret"
						value={account.sandboxSharedSecret}
						onChange={this.handleChange}
					/>
					<br />
					<CheckboxInput
						label="Auto-Settle Gateway Payments"
						id="auto-settle"
						name="autoSettle"
						checked={account.autoSettle}
						onChange={this.handleChange}
					/>
					<CheckboxInput
						label="Enable Healthcare Mode"
						id="healthcare-mode"
						name="healthcareMode"
						checked={account.healthcareMode}
						onChange={this.handleChange}
					/>
					<CheckboxInput
						label="Automatically cancel transactions with a declined remainder payment"
						id="remainder-pay-auto-cancel"
						name="remainderPayAutoCancel"
						checked={account.remainderPayAutoCancel}
						onChange={this.handleChange}
					/>
					<hr />
					<h3 className="section-heading color-primary">
						Embedded Checkout{" "}
						<span className="required float-right">* Shopify Plus required</span>
					</h3>
					<div className="info">
						<p className="margin-bottom-small">
							Shopify Plus merchants can replace the standard gateway redirect with
							an embedded {tenant} checkout form
						</p>
						<div className="learn-more">
							<a
								className="color-primary"
								href={tenant_links.shopify_plus}
								target="_blank"
							>
								Learn more
							</a>
						</div>
					</div>
					<CheckboxInput
						label="Enable Embedded Checkout"
						id="embedded-checkout"
						name="plusEmbeddedCheckout"
						checked={account.plusEmbeddedCheckout}
						onChange={this.handleChange}
					/>
					<CheckboxInput
						label="Enable Production Mode for Embedded Checkout"
						id="embedded-checkout-production"
						className={embeddedCheckoutDisabled ? "inactive" : ""}
						name="production"
						checked={account.production}
						disabled={embeddedCheckoutDisabled}
						onChange={this.handleChange}
					/>
					<hr />
					<h3 className="section-heading color-primary">Targeted Financing</h3>
					<div className="info">
						<p className="margin-bottom-small">
							Offer promotional financing programs based on the customer's cart total
						</p>
						<div className="learn-more">
							<a
								className="color-primary"
								href={tenant_links.targeted_financing}
								target="_blank"
							>
								Learn more
							</a>
						</div>
					</div>
					<CheckboxInput
						label="Enable Targeted Financing"
						id="targeted-financing"
						name="targetedFinancing"
						checked={account.targetedFinancing}
						onChange={this.handleChange}
					/>
					<p
						id="targeted-financing-info"
						className={account.targetedFinancing ? "slide-show" : "slide-hide"}
					>
						Targeted financing enabled for checkout page. Please enable targeted
						financing within the {tenant} App as well to target product and cart page
						buttons.
					</p>
					<TextInput
						title="Financing Program ID"
						id="targeted-financing-id"
						className={targetedFinancingDisabled ? "inactive" : ""}
						name="targetedFinancingID"
						value={account.targetedFinancingID}
						disabled={targetedFinancingDisabled}
						onChange={this.handleChange}
					/>
					<TextInput
						title="Cart Size Threshold (in dollars)"
						id="targeted-financing-threshold"
						className={"block-input" + (targetedFinancingDisabled ? " inactive" : "")}
						name="targetedFinancingThreshold"
						value={account.targetedFinancingThreshold}
						disabled={targetedFinancingDisabled}
						onChange={this.handleChange}
					/>
					<br />
					<div
						className={
							"floating-save" + (!this.state.formChanged ? "" : " show-opacity")
						}
					>
						<div className="discard-button">
							<span className="discard-action" onClick={this.clearChanges}>
								Discard
							</span>
						</div>
						<button
							className="form-button form-portal-button"
							type="submit"
							value="Submit"
							disabled={!this.state.formChanged}
						>
							<span>Save changes</span>
						</button>
					</div>
				</form>
			</div>
		);
	},
});

exports.BreadPlatformSettingsSection = React.createClass({
	mixins: [History],

	getInitialState: function () {
		return {
			account: {
				platformApiKey: "",
				platformSharedSecret: "",
				platformSandboxApiKey: "",
				platformSandboxSharedSecret: "",
				platformAutoSettle: false,
				integrationKey: "",
				sandboxIntegrationKey: "",
			},
			initial: {
				platformApiKey: "",
				platformSharedSecret: "",
				platformSandboxApiKey: "",
				platformSandboxSharedSecret: "",
				platformAutoSettle: false,
				integrationKey: "",
				sandboxIntegrationKey: "",
			},
			formChanged: false,
		};
	},

	componentDidMount: function () {
		this.compareSettings = debounce(this.compareSettings, 250);
		var self = this;
		Api.getAccountSettings().then(
			function (data) {
				var acc = {
					platformApiKey: data.platformApiKey,
					platformSharedSecret: data.platformSharedSecret,
					platformSandboxApiKey: data.platformSandboxApiKey,
					platformSandboxSharedSecret: data.platformSandboxSharedSecret,
					platformAutoSettle: data.platformAutoSettle,
					integrationKey: data.integrationKey,
					sandboxIntegrationKey: data.sandboxIntegrationKey,
				};
				self.setState({
					account: acc,
					initial: acc,
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

	handleChange: function (e) {
		var name = e.target.name;
		var value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		this.setState(function (state) {
			var account = Object.assign({}, state.account);
			account[name] = value;
			return {
				account: account,
			};
		}, this.compareSettings);
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var self = this;
		var accountSettings = this.getFormattedAccount();
		var valid = this.validateAccountData(accountSettings);
		if (valid !== true) {
			self.props.flashError(valid);
			return;
		}

		Api.updateBreadSettings(accountSettings, "platform").then(
			function (data) {
				self.props.flashSuccess("Success!");
				self.setState({
					account: accountSettings,
					initial: accountSettings,
					formChanged: false,
				});
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

	clearChanges: function (e) {
		e.preventDefault();
		var account = Object.assign({}, this.state.initial);
		this.setState(
			{
				account: account,
				formChanged: false,
			},
			function () {
				this.props.flashSuccess("Changes reverted");
			}.bind(this),
		);
	},

	compareSettings: function () {
		var account = this.state.account;
		var initial = this.state.initial;
		for (var prop in account) {
			if (account[prop] !== initial[prop]) {
				this.setState({ formChanged: true });
				return;
			}
		}
		this.setState({ formChanged: false });
	},

	getFormattedAccount: function () {
		var formattedAccount = {};
		var account = this.state.account;

		for (var prop in account) {
			if (typeof account[prop] === "string") {
				formattedAccount[prop] = account[prop].trim();
			} else {
				formattedAccount[prop] = account[prop];
			}
		}
		return formattedAccount;
	},

	validateAccountData: function (account) {
		var {
			platformApiKey,
			platformSharedSecret,
			platformSandboxApiKey,
			platformSandboxSharedSecret,
			platformGatewayKey,
			platformGatewaySecret,
			integrationKey,
			sandboxIntegrationKey,
		} = account;

		var UUIDValidator = RegExp(
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
		);

		var validBreadKeys = [
			platformApiKey,
			platformSandboxApiKey,
			integrationKey,
			sandboxIntegrationKey,
		].every(function (key) {
			return (
				key === "" ||
				key.includes("********-****-****-****-*****") ||
				UUIDValidator.test(key)
			);
		});

		if (!validBreadKeys) {
			return "Please enter valid keys";
		}

		if (
			platformApiKey === platformGatewayKey ||
			platformSandboxApiKey === platformGatewayKey
		) {
			return "Live and Sandbox API Keys should not be the same as the Gateway Key";
		}

		if (
			platformApiKey === platformGatewaySecret ||
			platformSandboxApiKey === platformGatewaySecret
		) {
			return "Live and Sandbox API Keys should not be the same as the Gateway Secret";
		}

		if (
			platformSharedSecret === platformGatewayKey ||
			platformSandboxSharedSecret === platformGatewayKey
		) {
			return "Live and Sandbox Secret Keys should not be the same as the Gateway Key";
		}

		if (
			platformSharedSecret === platformGatewaySecret ||
			platformSandboxSharedSecret === platformGatewaySecret
		) {
			return "Live and Sandbox Secret Keys should not be the same as the Gateway Secret";
		}

		return true;
	},

	render: function () {
		var account = this.state.account;

		return (
			<div className="section-wrapper">
				<h3 className="section-heading color-primary">Bread Authentication</h3>
				<div className="info">
					<p className="margin-bottom-small">
						Enter Bread API keys to connect your Bread merchant portal to your gateway
						account
					</p>
					<div className="learn-more">
						<a
							className="color-primary"
							href="https://docs.getbread.com/docs/integration/shopify/installing-the-shopify-bread-app/#install-and-configure-the-bread-gateway"
							target="_blank"
						>
							Learn more
						</a>
					</div>
				</div>
				<form onSubmit={this.handleSubmit}>
					<TextInput
						title="Live API Key"
						id="platform-live-api-key"
						name="platformApiKey"
						value={account.platformApiKey}
						onChange={this.handleChange}
						hint={
							<span className="hint float-right">
								Find keys in{" "}
								<a
									href="https://merchants.platform.breadpayments.com/"
									target="_blank"
								>
									merchants.platform.breadpayments.com
								</a>
							</span>
						}
					/>
					<TextInput
						title="Live Secret Key"
						id="platform-live-secret-key"
						name="platformSharedSecret"
						value={account.platformSharedSecret}
						onChange={this.handleChange}
					/>
					<TextInput
						title="Live Integration Key"
						id="integration-key"
						name="integrationKey"
						value={account.integrationKey}
						onChange={this.handleChange}
					/>
					<br />
					<TextInput
						title="Sandbox API Key"
						id="platform-sandbox-api-key"
						name="platformSandboxApiKey"
						value={account.platformSandboxApiKey}
						onChange={this.handleChange}
						hint={
							<span className="hint float-right">
								Find keys in{" "}
								<a
									href="https://merchants-preview.platform.breadpayments.com/"
									target="_blank"
								>
									merchants-preview.platform.breadpayments.com
								</a>
							</span>
						}
					/>
					<TextInput
						title="Sandbox Secret Key"
						id="platform-sandbox-secret-key"
						name="platformSandboxSharedSecret"
						value={account.platformSandboxSharedSecret}
						onChange={this.handleChange}
					/>
					<TextInput
						title="Sandbox Integration Key"
						id="sandbox-integration-key"
						name="sandboxIntegrationKey"
						value={account.sandboxIntegrationKey}
						onChange={this.handleChange}
					/>
					<br />
					<CheckboxInput
						label="Auto-Settle Gateway Payments"
						id="platform-auto-settle"
						name="platformAutoSettle"
						checked={account.platformAutoSettle}
						onChange={this.handleChange}
					/>
					<br />
					<div
						className={
							"floating-save" + (!this.state.formChanged ? "" : " show-opacity")
						}
					>
						<div className="discard-button">
							<span className="discard-action" onClick={this.clearChanges}>
								Discard
							</span>
						</div>
						<button
							className="form-button form-portal-button"
							type="submit"
							value="Submit"
							disabled={!this.state.formChanged}
						>
							<span>Save changes</span>
						</button>
					</div>
				</form>
			</div>
		);
	},
});

// Account Section allows a user to update their password
exports.AccountSection = React.createClass({
	mixins: [History],
	getInitialState: function () {
		return {
			oldPassword: "",
			newPassword: "",
			tenant: this.props.tenant,
		};
	},

	handleChange: function (e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var self = this;
		var payload = {
			oldPassword: this.state.oldPassword.trim(),
			newPassword: this.state.newPassword.trim(),
		};
		if (payload.newPassword.length == 0) {
			// flash info
			return;
		}
		Api.updateAccountSettings(payload).then(
			function (data) {
				self.setState({
					oldPassword: "",
					newPassword: "",
				});
				self.props.flashSuccess("Password updated");
			},
			function (status, err) {
				if (status == 401) return self.history.pushState(null, "signin");
				self.props.flashError(
					"Update failed. Ensure information is correct and try again.",
				);
			},
		);
	},

	render: function () {
		return (
			<div className="section-wrapper">
				<h3 className="section-heading color-primary">Account Settings</h3>
				<div className="info">
					<p className="margin-bottom">Update your gateway account password</p>
				</div>
				<form onSubmit={this.handleSubmit}>
					<TextInput
						title="Current Password"
						id="current-password"
						type="password"
						name="oldPassword"
						value={this.state.oldPassword}
						onChange={this.handleChange}
					/>
					<TextInput
						title="New Password"
						id="new-password"
						type="password"
						name="newPassword"
						value={this.state.newPassword}
						onChange={this.handleChange}
					/>
					<br />
					<div className="form-group-portal">
						<button
							className="form-button form-portal-button"
							type="submit"
							value="Submit"
							disabled={
								this.state.oldPassword === "" || this.state.newPassword === ""
							}
						>
							<span>Update password</span>
						</button>
					</div>
				</form>
			</div>
		);
	},
});

var Portal = React.createClass({
	render: function () {
		const tenant = Api.getTenant();
		return (
			<span>
				<GatewayCredentialsSection tenant={tenant} />
				<BreadSettingsSection tenant={tenant} />
				<AccountSection tenant={tenant} />
			</span>
		);
	},
});
