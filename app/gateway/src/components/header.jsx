var React = require("react");
var History = require("react-router").History;
var Api = require("../api.js");
var branding = require("../utils/branding.js");
var ActionCreators = require("../actions/creators.js");

var Header = React.createClass({
	mixins: [History],
	getInitialState: function () {
		return {
			showFlash: false,
		};
	},
	handleClick: function (e) {
		e.preventDefault();
		if (this.props.performLogout == true) {
			var self = this;
			Api.logOut().then(
				function (data) {
					self.history.pushState(null, self.props.buttonPage);
				},
				function (err) {
					// flash err
				},
			);
			return;
		}
		this.history.pushState(null, this.props.buttonPage);
	},
	componentWillReceiveProps: function (nextProps) {
		var self = this;
		Api.getTenant().then(function (data) {
			self.setState({ tenant: data.tenant });
		});
		if (typeof nextProps.flash.id == "number" && this.props.flash.id != nextProps.flash.id) {
			// stop old timeout
			clearTimeout(this.state.flashTimeout);

			// save old flash
			this.state.previousFlash = this.state.flash;

			// flash
			this.setState({
				showFlash: true,
			});
			this.props.flashTimeout = setTimeout(function () {
				self.setState({
					showFlash: false,
				});
			}, 4000);
		}
	},
	render: function () {
		return (
			<div className="bread-header">
				<div className="bread-header-content">
					<div className="bread-logo-container">
						<img
							className="bread-logo-img"
							src={branding.selectLogoPath(this.state.tenant)}
						></img>
					</div>
					<div className="bread-header-btn-container emphasis">
						<button
							onClick={this.handleClick}
							className="bread-header-btn"
							type="submit"
						>
							<span>{this.props.buttonText}</span>
						</button>
					</div>
				</div>
				<div
					className={
						"bread-flash-wrapper" +
						(this.state.showFlash ? " bread-flash-show" : " bread-flash-hide")
					}
				>
					<div
						className={
							"bread-flash-msg" +
							" bread-flash-" +
							this.props.flash.level.toLowerCase()
						}
					>
						<div className="bread-flash-msg-content">{this.props.flash.msg}</div>
					</div>
				</div>
			</div>
		);
	},
});

module.exports = Header;
