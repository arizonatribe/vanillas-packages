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

/**
 * Builds a list of all the unique file paths at a starting directory, recursively
 *
 * @function
 * @name getFileListRecursive
 * @param {string} dir The starting directory
 * @returns {Array<string>} The list of unique file paths at the starting directory
 */
export function getFileListRecursive(dir?: string): string[]

/**
 * Checks if a given file/folder path is an absolute path
 *
 * @function
 * @name isAbsolutePath
 * @param {string} loc The file/folder location
 * @returns {boolean} Whether or not the file/folder location is an absolute path
 */
export function isAbsolutePath(loc: string): boolean

/**
 * Resolves a path to a file or folder if is exists
 *
 * @function
 * @name resolvePathIfExists
 * @param {string} loc The file/folder location
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The resolved file/folder path (or undefined if it does not exist)
 */
export function resolvePathIfExists(loc: string, baseDir?: string): string | undefined

/**
 * Resolves paths to one or more files/folders using a glob pattern (but only if they exist)
 *
 * @function
 * @name resolveGlobIfExists
 * @param {string} glob A glob pattern to match
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {Array<string>|undefined} The resolved file/folder paths (or undefined if they don't exist)
 */
export function resolveGlobIfExists(glob: string, baseDir?: string): string[] | undefined

/**
 * A map of interpolation placeholders which serves as the map of placholders to replacment values
 *
 * @interface
 * @typedef {Object<string, string|boolean|number>} InterpolationMap
 */
export type InterpolationMap = {
  [key: string]: string | boolean | number
}

/**
 * Interpolates any placholders in a list of files with a set of provided values
 *
 * @function
 * @name interpolate
 * @param {Array<string>} files A list of one or more files to alter
 * @param {Object<string, string|boolean|number>} interpolationMap A map of interpolation placeholders which serves as the map of placholders to replacment values
 */
export function interpolate(files: string[], interpolationMap: InterpolationMap): void

/**
 * Executes a given command via the GIT binary
 *
 * @function
 * @name git
 * @throws {Error} If an error is thrown by Git or if it even writes to stderr
 * @param {string} command The git command to execute
 * @param {Array<string>} [args] Additional args to provide to the git command
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} If stdio is set to 'pipe', then the stdout will be returned
 */
export function git(command: string, args?: string[], baseDir?: string): string | undefined

/**
 * Checks a file or folder path to see if the current git repository ignores it
 *
 * @function
 * @name isIgnoredPath
 * @param {string} fpath The file or folder path to check
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {boolean} Whether or not the specified path is ignored in the current git repository
 */
export function isIgnoredPath(fpath: string, baseDir?: string): boolean

/**
 * Resolves all the file paths in a given repo which are not ignored
 *
 * @function
 * @name resolveRepoIncludedFiles
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {Array<string>} The resolved file paths for all the included (non gitignored) files in the repo
 */
export function resolveRepoIncludedFiles(baseDir? string): string[]
