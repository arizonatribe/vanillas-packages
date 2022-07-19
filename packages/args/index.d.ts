export interface AnyObject {
  [key: string]: any | AnyObject
}

export type ArgValue = string | number | boolean | string[] | number [] | boolean[] | AnyObject[] | AnyObject

export interface ParsedArgs {
  _: ArgValue[]
  [key: string]: ArgValue
}

/**
 * Parses command-line flags into a single object of camel-cased key/val pairs
 *
 * @function
 * @name parseArgs
 * @param {Array<*>} args Command-line args (will default to `process.argv.slice(2)` if nothing is provided)
 * @returns {ParsedArgs} The parsed command-line flags
 */
export function parseArgs(args: string[] | number[] | boolean[]): ParsedArgs

/**
 * Coerces a given value into a boolean or number (if appropriate) otherwise returns the value as-is
 *
 * @function
 * @name toArgValue
 * @param {string|boolean|number} arg A raw primitive value pulled from the command-line args (process.argv)
 * @returns {ArgValue} The original value, but coerced to a number or boolean _if_ that value was a stringified number or boolean
 */
export function toArgValue(arg: string | number | boolean): ArgValue

export default parseArgs
