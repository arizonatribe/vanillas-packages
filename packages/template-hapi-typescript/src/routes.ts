import { Server } from "@hapi/hapi"

import { Services } from "./services"
import { ServerConfig } from "./config"
import { BasicController } from "./controllers"

/**
 * Binds pre-configured controllers to the root Hapi server
 *
 * @function
 * @name addRoutes
 * @param {Server} server An instance of the root Hapi server
 * @param {ServerConfig} config The server configuration settings
 * @param {Services} _services The application services shared across plugins and routes
 * @returns {Server} The same server, enhanced with the controller methods bound to the appropriate routes
 */
function addRoutes(server: Server, config: ServerConfig, _services: Services) {
  const { name, version } = config

  server.route(new BasicController({ name, version }).routes())

  // TODO: Add any additional controller routes here

  return server
}

export default addRoutes
