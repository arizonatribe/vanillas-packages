const createBasicMiddleware = require("./basic")

/**
 * A factory function which creates all the app and common middleware
 *
 * @function
 * @name createMiddleware
 * @param {Object<string, any>} config The application configuration settings
 * @param {Object<string, function>} logger An instance of a threshold-based logger
 * @returns {Object<string, function>} All the server's middleware functions
 */
function createMiddleware(config, logger) {
  const basic = createBasicMiddleware(config, logger)

  return {
    ...basic
    // TODO merge in all your other middleware (specific to your data/domain needs) here
    // ...domain
  }
}

export default createMiddleware
