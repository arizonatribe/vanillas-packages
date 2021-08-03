const helmet = require("helmet")
const polka = require("polka")
const createLogger = require("pino")
const bodyParser = require("body-parser")
const compression = require("compression")

const config = require("./config")
const createRoutes = require("./routes")
const createMiddleware = require("./middleware")

const { name, level, apiVersion, shouldPrettyPrint } = config

const logger = createLogger({ level, prettyPrint: shouldPrettyPrint, name })
const middleware = createMiddleware(config, logger)

const {
  globalErrorHandler: onError,
  unsupportedEndpointHandler: onNoMatch
} = middleware

const app = polka({ onError, onNoMatch })
  .use(bodyParser.urlencoded({ extended: false, limit: "6mb" }))
  .use(bodyParser.json({ limit: "6mb" }))
  .use(compression())
  .use(helmet())
  .use(`/${apiVersion}`, createRoutes(middleware))

module.exports = app
