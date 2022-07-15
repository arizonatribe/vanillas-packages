import { Server, Request, ResponseToolkit } from "@hapi/hapi"

import { ServerConfig } from "../config"

/* Pulls the x-request-id off the headers and placed it into the context object */
export default function createPlugin(_config: ServerConfig) {
  return {
    version: "1.0.0",
    name: "request-id-enhancer",
    async register(server: Server) {
      server.ext("onRequest", (req: Request, res: ResponseToolkit) => {
        const possibleIds = ["x-request-id", "x-correlation-id"];

        let requestId = [
          ...possibleIds,
          ...possibleIds.map((i) => i.toUpperCase()),
          req.info?.id
        ].find(Boolean)

        if (!requestId) {
          requestId = [
            `(${(req.method || "GET").toUpperCase()})`,
            req.url,
            req.info?.remoteAddress,
            Date.now()
          ].filter(Boolean).join('|')
        }

        server.enterWith({ requestId })

        return res.continue
      })
    }
  }
}
