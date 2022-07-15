import { Boom } from "@hapi/boom"
import { Server, Request, ResponseToolkit } from "@hapi/hapi"

import { Services } from "../services"
import { ServerConfig } from "../config"

/**
 * A plugin which handles un-mapped endpoints/routes with a useful error message.
 *
 * @function
 * @name PluginCatchAll
 * @param {ServerConfig} _config The server configuration settings
 * @param {Services} services The application services shared across plugins and routes
 * @returns {function} A function which builds a HapiJs server configuration plugin object
 */
export function register(_config: ServerConfig, services: Services) {
  const { logger } = services

  return {
    version: "1.0.0",
    name: "catch-all-route-handler",
    async register(server: Server) {
      server.ext("onPreResponse", (req: Request, res: ResponseToolkit) => {
        /* Move forward in the request lifecycle if the asset was found */
        if ((req.response as Boom).output?.statusCode === 404) {
          return res.continue
        }

        logger.warn({ info: req.info, url: req.url, method: req.method, id: req.info?.id })

        logger.warn(`${req.method.toUpperCase()} request for unsupported endpoint: ${req.url}`)
        return res.response(`The endpoint ${
          req.url
        } is not supported by this application (or isn't supported for ${
          req.method
        } requests like these`).code(404)
      })
    }
  }
}

