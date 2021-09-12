interface AnyObject {
  [key: string]: any | AnyObject
}

export type ArgValue = string | number | boolean | string[] | number [] | boolean[] | AnyObject[] | AnyObject

export interface ParsedArgs {
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
 * @param {string|boolean|number} val A raw primitive value pulled from the command-line args (process.argv)
 * @returns {ArgValue} The original value, but coerced to a number or boolean _if_ that value was a stringified number or boolean
 */
export function toArgValue(arg: string | number | boolean): ArgValue

/**
 * Locates the first path which exists from a list of possible file paths.
 * Will fall back to `process.cwd()` as its base directory for any relative paths.
 *
 * @function
 * @name findPackagesFolder
 * @param {Array<string>} possibleLocations A list of either relative or absolute file paths which may exist
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The first path that exists
 */
export function findFirstWhichExists(possibleLocations: string[], baseDir?: string): string | undefined

/**
 * Locates the (absolute) path for the packages folder in a multi-package repository
 *
 * @function
 * @name findPackagesFolder
 * @param {string} [baseDir] An optional override starting path for resolving the packages folder (otherwise will start from this current directory and traverse upwards to several common, likely locations for the packages)
 * @returns {string|undefined} The path to the packages folder in a multi-package repo (if this is one)
 */
export function findPackagesFolder(baseDir?: string): string | undefined 

/**
 * Locates the (absolute) paths for all the packages in a multi-package repo which are TypeScript packages (specifically to their tsconfig.json manifests)
 *
 * @function
 * @name findTsConfigs
 * @param {string} [baseDir] An optional override starting path for resolving the packages folder (otherwise will start from this current directory and traverse upwards to several common, likely locations for the packages)
 * @returns {Array<string>|undefined} The paths to the tsconfig.json files for all the TypeScript packages
 */
export function findTsConfigs(baseDir?: string): string[] | undefined

/**
 * Locates the (absolute) path tsconfig.json file for this current project into which this base eslint config has been installed as one of its devDependencies
 *
 * @function
 * @name findCurrentProjectTsConfig
 * @param {string} [baseDir] An optional override starting path for resolving the packages folder (otherwise will start from this current directory and traverse upwards to several common, likely locations for the packages)
 * @returns {string|undefined} The path to the tsconfig.json file for this current project package
 */
export function findCurrentProjectTsConfig(baseDir?: string): string | undefined
