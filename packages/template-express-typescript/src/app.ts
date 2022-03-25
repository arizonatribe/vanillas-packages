import helmet from "helmet"
import express from "express"
import createLogger from "pino"
import compression from "compression"

import config from "./config"
import createRoutes from "./routes"
import createMiddleware, { Middleware } from "./middleware"

const { name, level, apiVersion, shouldPrettyPrint, isProduction } = config

const logger = createLogger({ level, prettyPrint: shouldPrettyPrint, name })

const {
  globalErrorHandler,
  allowCrossDomainMiddleware,
  unsupportedEndpointHandler,
  ...middleware
} = createMiddleware(config, logger)

const routes = createRoutes(middleware as Middleware)

const app = express()
  .use(express.urlencoded({ extended: false, limit: "6mb" }))
  .use(express.json({ limit: "6mb" }))
  .use(compression())
  .use(helmet())

if (!isProduction) {
  // Avoids CORS issues during local development
  // (especially when requests go through a UI being tested out in browsers like Chrome)
  app.use(allowCrossDomainMiddleware)
}

app.use(`/${apiVersion}`, routes)
  .use(globalErrorHandler)
  .use("*", unsupportedEndpointHandler)
  .use("/", unsupportedEndpointHandler)

export { app }
export default app
