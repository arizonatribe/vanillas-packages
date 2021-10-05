/* eslint-disable no-console */
const path = require("path")
const { spawnSync } = require("child_process")
const { resolvePathIfExists, resolveGlobIfExists } = require("./paths")

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
function git(command, args = [], baseDir) {
  if (command == null || (typeof command === "string" && !command.trim())) {
    throw new Error("Missing the git command to execute")
  }

  if (typeof command !== "string") {
    throw new TypeError("Invalid format for the git command. Should be a string")
  }

  if (
    args != null
    && (!Array.isArray(args) || args.some(arg => ["string", "number", "boolean"].every(type => typeof arg !== type)))
  ) {
    throw new TypeError("Invalid format for the git args. Should be a list of string values")
  }

  if (baseDir != null && !resolvePathIfExists(baseDir)) {
    throw new Error(`The base directory '${baseDir}' does not exist`)
  }

  const cwd = resolvePathIfExists(baseDir) || process.cwd()

  const { output: [_, stdout, stderr] } = spawnSync(
    "git",
    [...command.split(/\s/), ...args],
    { cwd, stdio: ["ignore", "pipe", "pipe"] }
  )

  if (stderr && stderr.toString().trim()) {
    console.error(new Error(stderr.toString().trim()))
  }

  return stdout ? stdout.toString() : undefined
}

/**
 * Checks a file or folder path to see if the current git repository ignores it
 *
 * @function
 * @name isIgnoredPath
 * @param {string} fpath The file or folder path to check
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {boolean} Whether or not the specified path is ignored in the current git repository
 */
function isIgnoredPath(fpath, baseDir) {
  const resolvedPath = !/^\//.test(fpath)
    ? path.resolve(baseDir || process.cwd(), fpath)
    : fpath

  const result = git("check-ignore", [resolvedPath], baseDir)

  return !!result
}

/**
 * Resolves all the file paths in a given repo which are not ignored
 *
 * @function
 * @name resolveRepoIncludedFiles
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {Array<string>} The resolved file paths for all the included (non gitignored) files in the repo
 */
function resolveRepoIncludedFiles(baseDir) {
  const resolvedFiles = resolveGlobIfExists("*/**", baseDir || process.cwd())
  return resolvedFiles.filter(f => !/node_modules/.test(f) && !isIgnoredPath(f))
}

module.exports = { git, isIgnoredPath, resolveRepoIncludedFiles }
