const polka = require("polka")

/**
 * Binds middleware to endpoints for an instance of the express application router.
 *
 * @function
 * @name createRoutes
 * @param {Object<string, function>} middleware A set of middleware functions which will be bound to routes
 * @param {function} middleware.healthCheck The health check (uptime) middleware
 * @param {function} middleware.globalErrorHandler Handles uncaught errors (or those pushed forward in the middleware's next function)
 * @param {function} middleware.unsupportedEndpointHandler Handles bad routes
 * @returns {Object<string, any>} An instance of the [Polka router](https://github.com/lukeed/trouter)
 */
function createRoutes(middleware) {
  const {
    healthCheck,
    globalErrorHandler: onError,
    unsupportedEndpointHandler: onNoMatch
  } = middleware

  return polka({ onError, onNoMatch })
    .get("/healthcheck", healthCheck)
}

module.exports = createRoutes
