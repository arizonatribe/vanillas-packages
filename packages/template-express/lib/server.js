const helmet = require("helmet")
const express = require("express")
const createLogger = require("pino")
const bodyParser = require("body-parser")
const compression = require("compression")

const config = require("./config")
const createRoutes = require("./routes")
const createMiddleware = require("./middleware")

const {
  port,
  host,
  name,
  level,
  version,
  apiVersion,
  isProduction,
  shouldPrettyPrint
} = config

const logger = createLogger({ level, prettyPrint: shouldPrettyPrint, name })

const {
  globalErrorHandler,
  unsupportedEndpointHandler,
  ...middleware
} = createMiddleware(config, logger)
const routes = createRoutes(middleware)

express()
  .use(bodyParser.urlencoded({ extended: false, limit: "6mb" }))
  .use(bodyParser.json({ limit: "6mb" }))
  .use(compression())
  .use(helmet())
  .use(`/${apiVersion}`, routes)
  .use(globalErrorHandler)
  .use("*", unsupportedEndpointHandler)
  .use("/", unsupportedEndpointHandler)
  .listen(port, "0.0.0.0", () => {
    /* eslint-disable-next-line no-console */
    console.log(`🚀 ${name} (${
      isProduction ? "prod" : "dev"
    }) v${version} now running at ${host}:${port}/${apiVersion}`)
  })
