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
  const primitiveValue = /^(true|false)$/i.test(val)
    ? /^true$/i.test(val)
    : /^\d+(\.\d+)?$/.test(val)
      ? +val
      : undefined
  if (primitiveValue != null) {
    return primitiveValue
  }

  try {
    return JSON.parse(val)
  } catch (err) {
    return /^([^,]+),([^,]+)/.test(val) ? val.split(",") : val
  }
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

  let lastArgName
  const options = {}

  for (let i = 0; i < len; i++) {
    const arg = argv[i]

    if (/^--?/.test(arg)) {
      const [key, val = true] = arg.replace(/^--?/, "").split("=")

      options[toCamelCase(key)] = toArgValue(val)

      if (/^([^=]+)=([^=]+)/.test(arg)) {
        lastArgName = undefined
      } else {
        lastArgName = toCamelCase(key)
      }
    } else {
      const argVal = toArgValue(arg)
      const argName = lastArgName || "_"
      options[argName] = options[argName] == null
        ? argVal
        : Array.isArray(options[argName])
          ? [...(options[argName]), argVal]
          : options[argName] === true
            ? (Array.isArray(argVal) ? argVal : [argVal])
            : [options[argName], argVal]
      lastArgName = undefined
    }
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
