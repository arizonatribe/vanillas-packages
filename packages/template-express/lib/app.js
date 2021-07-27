const helmet = require("helmet")
const express = require("express")
const createLogger = require("pino")
const bodyParser = require("body-parser")
const compression = require("compression")

const config = require("./config")
const createRoutes = require("./routes")
const createMiddleware = require("./middleware")

const { name, level, apiVersion, shouldPrettyPrint } = config

const logger = createLogger({ level, prettyPrint: shouldPrettyPrint, name })

const {
  globalErrorHandler,
  unsupportedEndpointHandler,
  ...middleware
} = createMiddleware(config, logger)
const routes = createRoutes(middleware)

module.exports = express()
  .use(bodyParser.urlencoded({ extended: false, limit: "6mb" }))
  .use(bodyParser.json({ limit: "6mb" }))
  .use(compression())
  .use(helmet())
  .use(`/${apiVersion}`, routes)
  .use(globalErrorHandler)
  .use("*", unsupportedEndpointHandler)
  .use("/", unsupportedEndpointHandler)
