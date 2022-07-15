import { ServerConfig } from "../config"
import { createLogger, Logger } from "./logger"

export interface Services {
  logger: Logger
}

/**
 * Creates instances of all the services used throughout the application
 *
 * @function
 * @name createServices
 * @param {ServerConfig} config The server configuration settings
 * @returns {Services} A collection of all the instantiated services used by the app
 */
function createServices(config: ServerConfig) {
  const logger = createLogger(config)

  return { logger }
}

export default createServices
