import * as Pulse from "hapi-pulse"

import { Services } from "../services"
import { ServerConfig } from "../config"

/**
 * A plugin which ensures graceful shutdown on user admin interrupts (ie SIGINT, SIGTERM).
 *
 * @function
 * @name PluginPulse
 * @param {ServerConfig} config The server configuration settings
 * @param {Services} services The application services shared across plugins and routes
 * @returns {function} A function which builds a HapiJs server configuration plugin object
 */
export function register(config: ServerConfig, services: Services) {
  const { name } = config
  const { logger } = services

  return {
    options: {
      logger,

      async preServerStop() {
        logger.warn(`${name} shutting down⚠️`)
      },

      async postServerStop() {
        logger.fatal(`${name} crashed‼️`)
      },

      async preShutdown() {
        logger.warn(`${name} exiting`)
      }
    },
    plugin: Pulse
  }
}
