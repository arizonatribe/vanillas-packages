import { Boom, isBoom } from "@hapi/boom"
import { Server, Request, ResponseToolkit } from "@hapi/hapi"

import { Services } from "../services"
import { ServerConfig } from "../config"

/**
 * A plugin which logs and handles error responses globally.
 * It also redacts 500-level error messages from the end user.
 *
 * @function
 * @name PluginErrors
 * @param {ServerConfig} _config The server configuration settings
 * @param {Services} services The application services shared across plugins and routes
 * @returns {function} A function which builds a HapiJs server configuration plugin object
 */
export function register(_config: ServerConfig, services: Services) {
  const { logger } = services

  return {
    version: "1.0.0",
    name: "global-error-handler",
    async register(server: Server) {
      server.ext("onPreResponse", (req: Request, res: ResponseToolkit) => {
        /* Move forward in the request lifecycle if the response is not in an error state */
        if (!isBoom(req.response as Error)) {
          return res.continue
        }

        logger.debug({ info: req.info, url: req.url, method: req.method, id: req.info?.id })

        const err = req.response as Boom
        const code = err.output.statusCode ?? 500
        const message = code >= 400 && code < 500
          ? err.message
          : "A server error has occurred"

        logger.error(err)

        return res.response(message).code(code)
      })
    }
  }
}
