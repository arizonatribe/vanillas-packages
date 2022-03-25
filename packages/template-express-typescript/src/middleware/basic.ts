import { Logger } from "pino"
import { Request, Response, NextFunction } from "express"

import { ErrorWithExtensions } from "../types"
import { ServerConfig } from "../config"

/**
 * A factory function which creates non-route specific middleware from the app's configuration settings.
 *
 * @function
 * @name createBasicMiddleware
 * @param {ServerConfig} config The application configuration settings
 * @param {Logger} logger An instance of a threshold-based logger
 * @returns {BasicMiddleware} The middleware functions ready to be bound to the app
 */
function createBasicMiddleware(config: ServerConfig, logger: Logger) {
  const { version, name } = config

  /**
   * A piece of middleware which will allow inbound requests from _any_ source regardless of its origin.
   * This should only be used in local development or in cases where there is 100% guarantee that the source is trusted
   * (due to where the API sits in your infrastructure, most likely).
   *
   * @function
   * @name allowCrossDomainMiddleware
   * @param {Request} _ The connect middleware HTTP request object
   * @param {Response} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
   * @param {NextFunction} next The reserved Express/connect middleware helper function which pushes execution forward (or triggers your error handler if you pass it an `Error` instance)
   */
  function allowCrossDomainMiddleware(_: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
  }

  /**
   * Displays application uptime and basic application metadata
   *
   * @function
   * @name healthCheck
   * @param {Request} req The connect middleware HTTP request object
   * @param {Response} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
   * @param {NextFunction} _ The `next` middleware function which normally pushes execution forward but is unused here at a catch-all function
   */
  function healthCheck(req: Request, res: Response, _: NextFunction) {
    res.status(200).json({
      version,
      name,
      success: true,
      status: "OK",
      timestamp: Date.now(),
      uptime: process.uptime()
    })
  }

  /**
   * The Express middleware global error handler middleware function (all express
   * applications should have one).
   *
   * @function
   * @name globalErrorHandler
   * @param {ErrorWithExtensions} err The error thrown (or rather pushed into `next(err)` elsewhere in the middleware chain)
   * @param {Request} _request The connect middleware HTTP request object, altered by previous middleware in various ways as sort of a shared context object pushed forward to the next middleware function
   * @param {Response} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
   * @param {NextFunction} _ The `next` middleware function which pushes execution forward in the chain (unused in a global error handler but necessary to name in the function params due to the way Express identifies this as an error handler - with four function params - rather than a normal middleware function)
   */
  function globalErrorHandler(err: ErrorWithExtensions, _request: Request, res: Response, _: NextFunction) {
    logger.error(err)
    res.status(err.extensions && err.extensions.code).json({
      success: false,
      message: err.message,
      data: err.extensions
    })
  }

  /**
   * A middleware function which handles un-mapped endpoints/routes with a useful error message.
   *
   * @function
   * @name unsupportedEndpointHandler
   * @param {Request} req The connect middleware HTTP request object, whose methods are used here to idntify the bad endpoint and the HTTP method used
   * @param {Response} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
   * @param {NextFunction} _ The `next` middleware function which normally pushes execution forward but is unused here at a catch-all function
   */
  function unsupportedEndpointHandler(req: Request, res: Response, _: NextFunction) {
    logger.warn(`${req.method.toUpperCase()} request for unsupported endpoint: ${req.originalUrl}`)

    res.status(404).json({
      success: false,
      message: `The endpoint '${
        req.originalUrl
      }' is not supported by this application (or isn't supported for ${
        req.method.toUpperCase()
      } requests like these)`
    })
  }

  return {
    healthCheck,
    globalErrorHandler,
    allowCrossDomainMiddleware,
    unsupportedEndpointHandler
  }
}

export type BasicMiddleware = ReturnType<typeof createBasicMiddleware>

export default createBasicMiddleware
