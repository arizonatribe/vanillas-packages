export interface AnyObject {
  [key: string]: any | AnyObject
}

/**
 * Parsed JSDoc AST
 *
 * @interface
 * @typedef {Object<string, any>} JSDocAst
 * @property {string} name
 * @property {string} longname
 * @property {string} description
 * @property {string} comment
 * @property {string} scope
 * @property {string} kind
 * @property {Array<Object<string, any>>} [params]
 * @property {Array<Object<string, any>>} [returns]
 */
export interface JSDocAst {
  name: string
  longname: string
  description: string
  comment: string
  scope: string
  kind: string
  params?: AnyObject[]
  returns?: AnyObject[]
}

export type ArgValue = string | number | boolean | string[] | number [] | boolean[] | AnyObject[] | AnyObject

/**
 * The kind of semantic versioning update
 *
 * @enum
 * @name SemverUpdateType
 * @type {string}
 */
export type SemverUpdateType = "major" | "minor" | "patch"

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
export function resolveRepoIncludedFiles(baseDir?: string): string[]

/**
 * Retrieves the file content at a given path and git branch
 *
 * @function
 * @name gitFileContent
 * @param {string} filePath The file path relative to the root of the git project
 * @param {string} [gitBranch=develop] The git branch to use
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|Object<string, any>|undefined} The content of the file at the specified git branch and file path (relative to the git project root). If a JSON file, then JSON is returned
 */
export function gitFileContent(filePath: string, gitBranch?: string, baseDir?: string): string | AnyObject | undefined

/**
 * Validates a given branch name (case-insensitive) against those of the current git repository
 *
 * @function
 * @name ensureValidGitBranch
 * @throws {Error} When the branch name is missing or in an invalid format
 * @throws {Error} When the branch name isn't among those listed for the current repository
 * @param {string} gitBranch The git branch to validate
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string} The validated branche name
 */
export function ensureValidGitBranch(gitBranch: string, baseDir?: string): string

/**
 * Retrieves the current git branch name
 *
 * @function
 * @name getCurrentBranchName
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The current branch name (if at a git repository)
 */
export function getCurrentBranchName(baseDir?: string): string

/**
 * Determine the kind of semantic versioning update (major, minor, or patch) based on the conventional commit message convention (fix:, feat:, and fix!: or feat!:)
 * @function
 * @name getConventionalCommitUpdate
 * @param {string} [startingBranch] The branch which is the source of the current version (defaults to the current branch, but that's rarely what you'd want, so usually you'll specifiy the branch)
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {SemverUpdateType|undefined} The semantic version update type (ie, 'major', 'minor', 'patch')
 */
export function getConventionalCommitUpdate(startingBranch?: string, baseDir?: string): SemverUpdateType | undefined

/**
 * Copies a source folder to a destination path (overwriting anything already existing at the destination)
 *
 * @function
 * @name copyFolder
 * @param {string} srcPath The source folder to be copied
 * @param {string} destPath The desination folder where the source folder is being copied to
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string} The full (absolute) desination path where the copying completed
 */
export function copyFolder(srcPath: string, destPath: string, baseDir?: string): string | undefined

/**
 * Renames a given file/folder path if it exists
 *
 * @function
 * @name renameIfExists
 * @param {string} oldPath The existing file/folder location
 * @param {string} newPath The new file/folder location
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The renamed file/folder path (or undefined if it did not exist to begin with)
 */
export function renameIfExists(oldPath: string, newPath: string, baseDir?: string): string | undefined

/**
 * Copies a folder nested nested inside one or more packages folders
 *
 * @function
 * @name copyNestedPackagesFolder
 * @throws {Error} When the packages folder doesn't exist
 * @throws {Error} When no nested folders are found in the packages folder
 * @param {string} [packagesFolder=packages] The packages sub-folder name (defaults to ./packages)
 * @param {string} [nestedFolder=docs] The folder nested across one or more packages folders
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {Array<string>} The list of copied (absolute) paths
 */
export function copyNestedPackagesFolder(packagesFolder: string, nestedFolder: string, baseDir?: string): string[]

/**
 * Resolves the JSDoc binary location (if exists)
 *
 * @function
 * @name resolveJsDocBin
 * @throws {Error} When unable to resolve the JSDoc binary
 * @param {string} [cwd=process.cwd()] The directory from which to check for the install JSDoc binary
 * @returns {string} The relative or absolute path to the JSDoc binary
 */
export function resolveJsDocBin(cwd?: string): string

/**
 * Parses the JSDoc comments from a given file
 *
 * @function
 * @name parseJsDocAst
 * @param {string} filePath The path to the JavaScript file itself
 * @param {string} [jsDocBin=jsdoc] The path to the JSDoc binary
 * @returns {Array<JSDocAst>} The list of JSDoc comments ASTs in the file
 */
export function parseJsDocAst(filePath: string, jsDocBin?: string): JSDocAst[]

/**
 * Parses the JSDoc comments from all the JavaScript files at given directory
 *
 * @function
 * @name parseJsFiles
 * @param {string} [dir=process.cwd()] The path to the JavaScript files
 * @param {boolean} [debug=false] Whether to log/debug to the console the progress of parsing the files
 * @returns {Array<JSDocAst>} The list of JSDoc comments ASTs in the file
 */
export function parseJsFiles(dir?: string, debug?: boolean): JSDocAst[]
