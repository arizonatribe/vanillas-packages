import { Server } from "@hapi/hapi"

import { Services } from "../services"
import { ServerConfig } from "../config"

import createPulsePlugin from "./pulse"
import createSwaggerPlugin from "./swagger"
import createRequestIdPlugin from "./requestId"
import createCatchAllPlugin from "./catchAll"
import createErrorHandlerPlugin from "./error"

/**
 * Registers all the plugins to the root Hapi server
 *
 * @function
 * @name addPlugins
 * @param {Server} server An instance of the root Hapi server
 * @param {ServerConfig} config The server configuration settings
 * @param {Services} services The application services shared across plugins and routes
 * @returns {Server} The same server, enhanced with the plugins registered to it
 */
function addPlugins(server: Server, config: ServerConfig, services: Services) {
  server.register(createErrorHandlerPlugin(config, services))
  server.register(createSwaggerPlugin(config))
  server.register(createRequestIdPlugin(config))
  server.register(createPulsePlugin(config, services))
  server.register(createCatchAllPlugin(config, services))

  return server
}

export default addPlugins
