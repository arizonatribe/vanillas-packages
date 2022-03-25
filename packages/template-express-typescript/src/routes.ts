import { Router } from "express"
import { Middleware } from "./middleware"

const router = Router()

/**
 * Binds middleware to endpoints for an instance of the express application router.
 *
 * @function
 * @name createRoutes
 * @param {Middleware} middleware A set of middleware functions which will be bound to routes
 * @returns {Router} An instance of the [Express Router](https://expressjs.com/en/api.html#router)
 */
function createRoutes(middleware: Middleware) {
  const { healthCheck } = middleware

  return router
    .get("/healthcheck", healthCheck)
}

export default createRoutes
