import { Boom } from "@hapi/boom"
import { Server, Request, ResponseToolkit } from "@hapi/hapi"

import { Services } from "../services"
import { ServerConfig } from "../config"

export default function createPlugin(_config: ServerConfig, services: Services) {
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

