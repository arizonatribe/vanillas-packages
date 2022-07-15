import { Server } from "@hapi/hapi"

import addRoutes from "./routes"
import addPlugins from "./plugins"
import createServices, { Services } from "./services"
import createConfig, { ServerConfig } from "./config"

/**
 * The Hapi server, config settings, and app services
 *
 * @interface
 * @typedef {Object<string, Server|ServerConfig|Services>} App
 * @property {Server} server The Hapi server instance
 * @property {ServerConfig} config The server configuration settings
 * @property {Services} services The app services, shared across controllers and plugins
 */
export interface App {
  server: Server
  config: ServerConfig
  services: Services
}

/**
 * Creates an instance of the Hapi server, enhanced with plugins and routes having been defined.
 *
 * @function
 * @name createServer
 * @param {ServerConfig} config The server configuration settings
 * @param {Services} services The application services shared across plugins and routes
 * @returns {Server} The same server, enhanced with plugins and any defined controller routes
 */
export function createServer(config: ServerConfig, services: Services): Server {
  const { isProduction, port } = config

  const server = new Server({
    port,
    ...(!isProduction && {
      routes: {
        cors: {
          origin: ["*"],
          headers: ["Content-Type"]
        }
      }
    })
  })

  addRoutes(server, config, services)
  addPlugins(server, config, services)

  return server
}

/**
 * Builds the application config settings from the environment, and uses that to create a web server (one which may also have external resources configured).
 *
 * @async
 * @function
 * @name createApp
 * @throws {Error} If any environment config settings cannot be created or external services cannot be reached
 * @returns {Promise<App>} A promise which resolves with the server, its config settings and services
 */
async function createApp() {
  const config = await createConfig()
  const services = createServices(config)
  const server = createServer(config, services)
  return { server, config, services } as App
}

export default createApp
