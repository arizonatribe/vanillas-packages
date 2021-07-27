const pkg = require("../package.json")
const env = require("./env")

/**
 * The application configuration object
 *
 * @typedef {Object<string, number|boolean|string>} ServerConfig
 * @property {string} level The logging threshold level
 * @property {string} host The host/hostname for the application (without the transport protocol prefix)
 * @property {boolean} isProduction Whether or not this application is running in production
 * @property {string} version The semantic version of the application
 * @property {string} apiVersion The API version prefix used externally to hit any of the application's endpoints
 * @property {string} name The name of the application
 * @property {boolean} [shouldPrettyPrint] Whether or not to format the stdout/stderr logs in a visually styled manner (mainly for local development).
 */
module.exports = {
  name: pkg.name,
  apiVersion: `v${pkg.version.split(".")[0]}`,
  version: pkg.version,
  shouldPrettyPrint: env.PRETTY_PRINT,
  host: env.HOST,
  port: env.PORT,
  level: env.LOG_LEVEL,
  isProduction: env.NODE_ENV === "production"
}
