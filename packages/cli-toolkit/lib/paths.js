const fs = require("fs")
const path = require("path")
const glob = require("glob")

/**
 * Checks if a given file/folder path is an absolute path
 *
 * @function
 * @name isAbsolutePath
 * @param {string} loc The file/folder location
 * @returns {boolean} Whether or not the file/folder location is an absolute path
 */
function isAbsolutePath(loc) {
  return /^\//.test(loc)
}

/**
 * Resolves a path to a file or folder if is exists
 *
 * @function
 * @name resolvePathIfExists
 * @param {string} loc The file/folder location
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The resolved file/folder path (or undefined if it does not exist)
 */
function resolvePathIfExists(loc, baseDir) {
  if (typeof loc !== "string" || !loc.trim()) return undefined

  if (isAbsolutePath(loc)) {
    return fs.existsSync(loc) ? loc : undefined
  }

  return fs.existsSync(path.resolve(baseDir || process.cwd(), loc))
    ? path.resolve(baseDir || process.cwd(), loc)
    : undefined
}

/**
 * Resolves paths to one or more files/folders using a glob pattern (but only if they exist)
 *
 * @function
 * @name resolveGlobIfExists
 * @param {string} g A glob pattern to match
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {Array<string>|undefined} The resolved file/folder paths (or undefined if they don't exist)
 */
function resolveGlobIfExists(g, baseDir) {
  if (typeof g !== "string" || !g.trim()) return undefined

  const options = baseDir && resolvePathIfExists(baseDir)
    ? { cwd: resolvePathIfExists(baseDir) }
    : undefined

  const files = glob.sync(g, options)
  return Array.isArray(files)
    ? files.map(f => resolvePathIfExists(f, baseDir || process.cwd())).filter(Boolean)
    : resolvePathIfExists(files)
      ? [files]
      : undefined
}

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
function findFirstWhichExists(possibleLocations, baseDir) {
  return (Array.isArray(possibleLocations) ? possibleLocations : [])
    .map(loc => resolvePathIfExists(loc, baseDir))
    .find(Boolean)
}

/**
 * Builds a list of all the unique file paths at a starting directory, recursively
 *
 * @function
 * @name getFileListRecursive
 * @param {string} dir The starting directory
 * @returns {Array<string>} The list of unique file paths at the starting directory
 */
function getFileListRecursive(dir) {
  const fileList = []

  fs.readdirSync(dir || process.cwd())
    .filter(f => !/node_modules/.test(f))
    .forEach(file => {
      const filePath = path.resolve(dir, file);
      (fs.statSync(filePath).isDirectory()
        ? getFileListRecursive(filePath)
        : [filePath]
      ).forEach(f => {
        fileList.push(f)
      })
    })

  return Array.from(new Set(fileList))
}

/**
 * Locates the (absolute) path for the packages folder in a multi-package repository
 *
 * @function
 * @name findPackagesFolder
 * @param {string} [baseDir] An optional override starting path for resolving the packages folder (otherwise will start from this current directory and traverse upwards to several common, likely locations for the packages)
 * @returns {string|undefined} The path to the packages folder in a multi-package repo (if this is one)
 */
function findPackagesFolder(baseDir) {
  const possiblePackagesRootLocations = [
    /* A standard multi-package repository where packages are in a root packages/ or workspaces/ directory off the root of the repo */
    "../../../packages",
    "../../../workspaces",

    /* When this is installed into node_modules/@scope/eslint-config/ inside of one of the non-hoisted packages off the root packages/ or workspaces/ directory */
    "../../../../../../packages",
    "../../../../../../workspaces",

    /* When this is installed into node_modules/@scope/eslint-config/ but not hoisted (qnd this is run from that package root as a process.cwd()) */
    "../../../../../packages",
    "../../../../../workspaces",

    /* When this is installed into node_modules/@scope/eslint-config/ but hoisted to the top-level node_modules/ off the root */
    "../../../../packages",
    "../../../../workspaces",

    /* When the baseDir is supplied and it is the root of one of the repos in a multi-package repo */
    "../../packages",
    "../../workspaces",

    /* When the baseDir is supplied and it is the root of the multi-package
     * repo */
    "./packages",
    "./workspaces"
  ]

  return findFirstWhichExists(possiblePackagesRootLocations, baseDir)
}

/**
 * Locates the (absolute) paths for all the packages in a multi-package repo which are TypeScript packages (specifically to their tsconfig.json manifests)
 *
 * @function
 * @name findTsConfigs
 * @param {string} [baseDir] An optional override starting path for resolving the packages folder (otherwise will start from this current directory and traverse upwards to several common, likely locations for the packages)
 * @returns {Array<string>|undefined} The paths to the tsconfig.json files for all the TypeScript packages
 */
function findTsConfigs(baseDir) {
  const packagesFolder = findPackagesFolder(baseDir)
  if (packagesFolder) {
    const tsConfigPaths = fs.readdirSync(packagesFolder)
      .map(pkgFolder => path.resolve(packagesFolder, pkgFolder, "tsconfig.json"))
      .filter(tsConfigPath => fs.existsSync(tsConfigPath))

    return tsConfigPaths.length ? tsConfigPaths : undefined
  }

  return undefined
}

/**
 * Locates the (absolute) path tsconfig.json file for this current project into which this base eslint config has been installed as one of its devDependencies
 *
 * @function
 * @name findCurrentProjectTsConfig
 * @param {string} [baseDir] An optional override starting path for resolving the packages folder (otherwise will start from this current directory and traverse upwards to several common, likely locations for the packages)
 * @returns {string|undefined} The path to the tsconfig.json file for this current project package
 */
function findCurrentProjectTsConfig(baseDir) {
  const possibleTsConfigLocations = [
    /* When the baseDir is supplied and it is the root of the repo */
    "./tsconfig.eslint.json",
    "./tsconfig.json",
    "./tsconfig.build.json",

    /* When this is installed into node_modules/@scope/eslint-config/ of a
* dependent package/project */
    "../../../../tsconfig.eslint.json",
    "../../../../tsconfig.json",
    "../../../../tsconfig.build.json",

    /* Looks for the tsconfig.json at the root of a multi-package repo in
* which this current package lives */
    "../../../tsconfig.eslint.json",
    "../../../tsconfig.json",
    "../../../tsconfig.build.json",

    /* When this is installed into node_modules/@scope/eslint-config/
     * inside of one of the non-hoisted packages off the root packages/ or
     * workspaces/ directory */
    "../../../../../../tsconfig.eslint.json",
    "../../../../../../tsconfig.json",
    "../../../../../../tsconfig.build.json"
  ]

  return findFirstWhichExists(possibleTsConfigLocations, baseDir)
}

module.exports = {
  findCurrentProjectTsConfig,
  findFirstWhichExists,
  findPackagesFolder,
  findTsConfigs,
  isAbsolutePath,
  getFileListRecursive,
  resolveGlobIfExists,
  resolvePathIfExists
}
