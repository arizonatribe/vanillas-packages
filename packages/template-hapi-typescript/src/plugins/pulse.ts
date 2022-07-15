import * as Pulse from "hapi-pulse"

import { Services } from "../services"
import { ServerConfig } from "../config"

export default function createPlugin(config: ServerConfig, services: Services) {
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
