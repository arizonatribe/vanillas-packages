import { Server } from "@hapi/hapi"

import { Services } from "../services"
import { ServerConfig } from "../config"

import * as pulse from "./pulse"
import * as swagger from "./swagger"
import * as catchAll from "./catchAll"
import * as errors from "./error"

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
  server.register(errors.register(config, services))
  server.register(swagger.register(config))
  server.register(pulse.register(config, services))
  server.register(catchAll.register(config, services))

  return server
}

export default addPlugins
