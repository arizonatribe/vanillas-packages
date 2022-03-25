import { Level } from "pino"
import env from "./env"

const pkg = require("../../package.json")

/**
 * The application configuration object
 *
 * @interface
 * @typedef {Object<string, number|boolean|string>} ServerConfig
 * @property {string} apiVersion The API version prefix used externally to hit any of the application's endpoints
 * @property {string} host The host/hostname for the application (without the transport protocol prefix)
 * @property {boolean} isProduction Whether or not this application is running in production
 * @property {Level} level The logging threshold level
 * @property {string} name The name of the application
 * @property {number} port The TCP port number on which the server runs
 * @property {boolean} shouldPrettyPrint Whether or not to format the stdout/stderr logs in a visually styled manner (mainly for local development).
 * @property {string} version The semantic version of the application
 */
export interface ServerConfig {
  apiVersion: string
  name: string
  host: string
  isProduction: boolean
  level: Level
  port: number
  shouldPrettyPrint: boolean
  version: string
}

export const config = {
  name: pkg.name,
  apiVersion: `v${pkg.version.split(".")[0]}`,
  version: pkg.version,
  shouldPrettyPrint: env.PRETTY_PRINT,
  host: env.HOST,
  port: env.PORT,
  level: env.LOG_LEVEL,
  isProduction: env.NODE_ENV === "production"
} as ServerConfig

export default config
