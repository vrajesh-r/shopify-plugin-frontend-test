import { datadogLogs } from "@datadog/browser-logs";

function datadogLog(level, message, context) {
	switch (level) {
		case "error":
			datadogLogs.logger.error(message, context);
			break;
		case "warn":
			datadogLogs.logger.warn(message, context);
			break;
		case "info":
			datadogLogs.logger.info(message, context);
			break;
		default:
			datadogLog.logger.debug(message, context);
	}
}

export { datadogLog };
