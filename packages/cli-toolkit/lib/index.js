const toCamelCase = require("vanillas/toCamelCase")

/**
 * Coerces a given value into a boolean or number (if appropriate) otherwise returns the value as-is
 *
 * @function
 * @name toArgValue
 * @param {string|boolean|number|Array<*>|object} val A value of any type
 * @returns {boolean|number|string|Array<*>|object} The original value, but coerced to a number or boolean _if_ that value was a stringified number or boolean
 */
function toArgValue(val) {
  return /^(true|false)$/i.test(val)
    ? /^true$/i.test(val)
    : /^\d+(\.\d+)?$/.test(val)
      ? +val
      : val
}

/**
 * Parses command-line flags into a single object of camel-cased key/val pairs
 *
 * @function
 * @name parseArgs
 * @param {Array<*>} args Command-line args (will default to `process.argv.slice(2)` if nothing is provided)
 * @returns {object} The parsed command-line flags
 */
function parseArgs(args) {
  const argv = Array.isArray(args)
    ? [...args]
    : process.argv.slice(2)
  const len = argv.length

  const options = {}
  const argValues = []
  let lastArgName

  for (let i = 0; i < len; i++) {
    const arg = argv[i]

    if (/^--/.test(arg)) {
      const [key, val] = toCamelCase(arg.replace(/^--/, "")).split("=")

      if (argValues.length && lastArgName) {
        while (argValues.length) {
          options[lastArgName] = [
            ...(options[lastArgName] || []),
            toArgValue(argValues.pop())
          ]
        }
      }

      options[key] = toArgValue(val)

      lastArgName = key
    } else {
      argValues.push(toArgValue(arg))
    }
  }

  if (argValues.length) {
    // arg values which don't have a corresponding CLI flag
    options[0] = argValues.length === 1
      ? argValues[0]
      : (!argValues.length || argValues)
  }

  Object.keys(options)
    .filter(k => options[k] === undefined)
    .forEach(key => {
      options[key] = true
    })

  return options
}

module.exports = {
  toArgValue,
  parseArgs
}
