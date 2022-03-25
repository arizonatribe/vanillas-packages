import { Logger } from "pino"
import { ServerConfig } from "../config"
import createBasicMiddleware, { BasicMiddleware } from "./basic"

export interface Middleware extends BasicMiddleware { }

/**
 * A factory function which creates all the app and common middleware
 *
 * @function
 * @name createMiddleware
 * @param {ServerConfig} config The application configuration settings
 * @param {Logger} logger An instance of a threshold-based logger
 * @returns {Middleware} All the server's middleware functions
 */
function createMiddleware(config: ServerConfig, logger: Logger) {
  const basic = createBasicMiddleware(config, logger)

  return {
    ...basic
    // TODO merge in all your other middleware (specific to your data/domain needs) here
    // ...domain
  } as Middleware
}

export default createMiddleware
