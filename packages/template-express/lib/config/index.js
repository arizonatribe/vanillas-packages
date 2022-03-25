const env = require("./env")

const pkg = require("../../package.json")

/**
 * The application configuration object
 *
 * @typedef {Object<string, number|boolean|string>} ServerConfig
 * @property {string} apiVersion The API version prefix used externally to hit any of the application's endpoints
 * @property {string} host The host/hostname for the application (without the transport protocol prefix)
 * @property {boolean} isProduction Whether or not this application is running in production
 * @property {string} level The logging threshold level
 * @property {string} name The name of the application
 * @property {number} port The TCP port number on which the server runs
 * @property {boolean} [shouldPrettyPrint] Whether or not to format the stdout/stderr logs in a visually styled manner (mainly for local development).
 * @property {string} version The semantic version of the application
 */
module.exports = {
  apiVersion: `v${pkg.version.split(".")[0]}`,
  host: env.HOST,
  isProduction: env.NODE_ENV === "production",
  level: env.LOG_LEVEL,
  name: pkg.name,
  port: env.PORT,
  shouldPrettyPrint: env.PRETTY_PRINT,
  version: pkg.version
}
