const helmet = require("helmet")
const express = require("express")
const createLogger = require("pino")
const compression = require("compression")

const config = require("./config")
const createRoutes = require("./routes")
const createMiddleware = require("./middleware")

const { name, level, apiVersion, shouldPrettyPrint, isProduction } = config

const logger = createLogger({ level, prettyPrint: shouldPrettyPrint, name })

const {
  globalErrorHandler,
  unsupportedEndpointHandler,
  allowCrossDomainMiddleware,
  ...middleware
} = createMiddleware(config, logger)
const routes = createRoutes(middleware)

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

app
  .use(`/${apiVersion}`, routes)
  .use(globalErrorHandler)
  .use("*", unsupportedEndpointHandler)
  .use("/", unsupportedEndpointHandler)

module.exports = app
module.exports.app = app
