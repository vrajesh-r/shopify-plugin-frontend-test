function selectDocumentationLinks(tenant) {
	switch (tenant) {
		default:
			return {
				gateway_instructions:
					"https://docs.getbread.com/docs/integration/shopify/installing-the-shopify-bread-app/#install-and-configure-the-bread-gateway",
				merchant_portal: "https://merchants.getbread.com/",
				merchant_portal_clipped: "merchants.getbread.com",
				merchant_portal_sandbox: "https://merchants-sandbox.getbread.com/",
				merchant_portal_sandbox_clipped: "merchants-sandbox.getbread.com",
				shopify_plus:
					"https://docs.getbread.com/docs/integration/shopify/shopify-plus-features/#embedded-checkout-on-shopify-plus",
				targeted_financing:
					"https://docs.getbread.com/docs/integration/shopify/targeted-financing/",
				install_instructions:
					"https://docs.getbread.com/docs/integration/shopify/installing-the-shopify-bread-app/",
			};
	}
}
function selectLogoPath(tenant) {
	switch (tenant) {
		case "RBC":
			return "/gateway/assets/rbc-logo.svg";
		default:
			return "/gateway/assets/bread-logo-white.svg";
	}
}
export { selectLogoPath, selectDocumentationLinks };
