const Router = require("express/lib/router")

const router = Router()

/**
 * Binds middleware to endpoints for an instance of the express application router.
 *
 * @function
 * @name createRoutes
 * @param {Object<string, function>} middleware A set of middleware functions which will be bound to routes
 * @param {function} middleware.healthCheck The health check (uptime) middleware
 * @returns {Object<string, any>} An instance of the [Express Router](https://expressjs.com/en/api.html#router)
 */
function createRoutes(middleware) {
  const { healthCheck } = middleware

  return router
    .get("/healthcheck", healthCheck)
}

module.exports = createRoutes
