/**
 * GitHub MCP Server Constants
 */
export const API_BASE_URL = "https://api.github.com";
export const API_VERSION = "2022-11-28";
export const CHARACTER_LIMIT = 25000;
export const DEFAULT_PER_PAGE = 30;
export const MAX_PER_PAGE = 100;
export const REQUEST_TIMEOUT = 30000; // 30 seconds
export var ResponseFormat;
(function (ResponseFormat) {
    ResponseFormat["MARKDOWN"] = "markdown";
    ResponseFormat["JSON"] = "json";
})(ResponseFormat || (ResponseFormat = {}));
//# sourceMappingURL=constants.js.map