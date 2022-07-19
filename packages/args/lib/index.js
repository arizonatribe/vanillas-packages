/**
 * Transforms a string value into one which is hyphenated.
 * Hyphens and underscores are removed and interpred as the boundaries for new words.
 * The first letter of each new word - not preceded by whitespace - is capitalized.
 *
 * @function
 * @name _toCamelCase
 * @param {string} str A string which may contain underscores and hyphens and/or may be title-cased.
 * @returns {string} A new string that is without hyphens and underscores and the first letter of every new word boundary is capitalized, unless preceded by whitespace
 */
function _toCamelCase(str) {
  return [
    str.charAt(0).toLowerCase(),
    str.slice(1)
      .replace(/[_-]+[a-z]/ig, w => w.replace(/[_-]/g, "").toUpperCase())
      .replace(/\s+[A-Z]/g, w => w.toLowerCase())
  ].join("")
}

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

      options[_toCamelCase(key)] = toArgValue(val)

      if (/^([^=]+)=([^=]+)/.test(arg)) {
        lastArgName = undefined
      } else {
        lastArgName = _toCamelCase(key)
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
    }
  }

  Object.keys(options).forEach(key => {
    if (options[key] === undefined) {
      options[key] = true
    } else if (key !== "_" && options[key].length === 1) {
      [options[key]] = options[key]
    } else if (key === "_" && !Array.isArray(options[key])) {
      options[key] = [options[key]]
    }
  })

  return options
}

module.exports = parseArgs
module.exports.toArgValue = toArgValue
module.exports.parseArgs = parseArgs
