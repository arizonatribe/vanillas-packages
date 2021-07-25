/**
 * A factory function which creates non-route specific middleware from the app's configuration settings.
 *
 * @function
 * @name createMiddleware
 * @param {Object<string, any>} config The application configuration settings
 * @param {Object<string, function>} _logger An instance of a threshold-based logger
 * @returns {Object<string, function>} The middleware functions ready to be bound to the app
 */
function createMiddleware(config, _logger) {
  const { version, name } = config

  /**
   * Displays application uptime and basic application metadata
   *
   * @function
   * @name healthCheck
   * @param {Object<string, any>} req The connect middleware HTTP request object
   * @param {Object<string, function>} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
   * @param {function} _ The `next` middleware function which normally pushes execution forward but is unused here at a catch-all function
   */
  function healthCheck(req, res, _) {
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
   * @param {Error} err The error thrown (or rather pushed into `next(err)` elsewhere in the middleware chain)
   * @param {Object<string, any>} _request The connect middleware HTTP request object, altered by previous middleware in various ways as sort of a shared context object pushed forward to the next middleware function
   * @param {Object<string, function>} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
   * @param {function} _ The `next` middleware function which pushes execution forward in the chain (unused in a global error handler but necessary to name in the function params due to the way Express identifies this as an error handler - with four function params - rather than a normal middleware function)
   */
  function globalErrorHandler(err, _request, res, _) {
    res.status(err.extensions && err.extensions.code).json({
      success: false,
      message: err.message,
      data: err.extensions || err.data
    })
  }

  /**
   * A middleware function which handles un-mapped endpoints/routes with a useful error message.
   *
   * @function
   * @name unsupportedEndpointHandler
   * @param {Object<string, any>} req The connect middleware HTTP request object, whose methods are used here to idntify the bad endpoint and the HTTP method used
   * @param {Object<string, function>} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
   * @param {function} _ The `next` middleware function which normally pushes execution forward but is unused here at a catch-all function
   */
  function unsupportedEndpointHandler(req, res, _) {
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
    unsupportedEndpointHandler
  }
}

module.exports = createMiddleware
