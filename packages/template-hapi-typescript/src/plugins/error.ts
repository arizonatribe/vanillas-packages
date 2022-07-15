import { Boom, isBoom } from "@hapi/boom"
import { Server, Request, ResponseToolkit } from "@hapi/hapi"

import { Services } from "../services"
import { ServerConfig } from "../config"

export default function createPlugin(_config: ServerConfig, services: Services) {
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
