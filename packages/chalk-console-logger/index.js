const chalk = require("chalk")
const { LOG_LEVEL } = require("@vanillas/console-logger")

/**
 * A helper method which logs to the console - using the specified Console API method name - and injects the [chalk](https://www.npmjs.com/package/chalk) to any argu which is a function
 *
 * @function
 * @private
 * @name Logger#_log
 * @param {string} methodName One fo the Console API method names
 * @param {Array<*>} ...args Any value passed into the console
 */
function _log(methodName, ...args) {
  /* eslint-disable-next-line no-console */
  console[methodName](...args.map(arg => (typeof arg === "function" ? arg(chalk) : arg)))
}

/**
 * A wrapper around the console API to restrict the logging based on a threshold level
 * @class
 * @name Logger
 */
const logger = {
  /**
   * Changes the threshold level that controls the logging to the console
   *
   * @function
   * @name Logger#setLevel
   * @param {string} level The level to set the threshold based logger (defaults to 'info')
   */
  setLevel(level) {
    logger.level = Object.keys(LOG_LEVEL).find(l => (new RegExp(l, "i")).test(level)) || "info"
  },

  /**
   * Logs to the console at the "trace" level (ie, the lowest)
   *
   * @function
   * @name Logger#trace
   */
  trace(...args) {
    if (logger.level === "trace") {
      _log(logger.level, ...args)
    }
  },

  /**
   * Logs to the console at the "debug" level (ie, the 2nd lowest)
   *
   * @function
   * @name Logger#debug
   */
  debug(...args) {
    if (/^(trace|debug)$/.test(logger.level)) {
      _log(logger.level, ...args)
    }
  },

  /**
   * Logs to the console at the "info" level (ie, the 3rd lowest and standard operating level)
   *
   * @function
   * @name Logger#info
   */
  info(...args) {
    if (/^(trace|debug|info)$/.test(logger.level)) {
      _log(logger.level, ...args)
    }
  },

  /**
   * Logs to the console at the "warn" level (ie, just barely above the standard operating level of 'info')
   *
   * @function
   * @name Logger#warn
   */
  warn(...args) {
    if (/^(trace|debug|info|warn)$/.test(logger.level)) {
      _log(logger.level, ...args)
    }
  },

  /**
   * Logs to the console at the "error" level (ie, the 2nd highest level)
   *
   * @function
   * @name Logger#error
   */
  error(...args) {
    if (/^(trace|debug|info|warn|error)$/.test(logger.level)) {
      _log(logger.level, ...args)
    }
  },

  /**
   * Logs to the console at the "fatal" level (ie, the highest operating level; only errors which cause the app to crash)
   *
   * @function
   * @name Logger#fatal
   */
  fatal(...args) {
    _log(logger.level, ...args)
  },

  /**
   * Logs to the console outside of the threshold-based control
   *
   * @function
   * @name Logger#log
   */
  log(...args) {
    _log(logger.level, ...args)
  }
}

logger.level = "info"

module.exports = logger
module.exports.LOG_LEVEL = LOG_LEVEL
