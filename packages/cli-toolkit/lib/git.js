/* eslint-disable no-console */
const fs = require("fs")
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
    /* Git uses stderr a lot (and the community doubles-down and turns up the cognitive dissonance whenever they've been approached about changing it) */
    return stderr.toString().trim().replace(/\n$/, "")
  }

  return stdout ? stdout.toString().replace(/\n$/, "") : undefined
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
  return resolvedFiles.filter(f => !/node_modules/.test(f) && !fs.statSync(f).isDirectory() && !isIgnoredPath(f))
}

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
function gitFileContent(filePath, gitBranch = "develop", baseDir) {
  const remote = git("remote", undefined, baseDir)
  const content = git("show", [`${remote}/${gitBranch}:${filePath}`], baseDir)
  if (/^[^.]+\.json$/.test(filePath)) {
    return JSON.parse(content)
  }
  return content
}

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
function ensureValidGitBranch(gitBranch, baseDir) {
  if (gitBranch == null || (typeof gitBranch === "string" && !gitBranch.trim())) {
    throw new Error("Missing the git branch name")
  }

  if (typeof gitBranch !== "string" || /\s/.test(gitBranch)) {
    throw new Error("Invalid format for the git branch. Should be a string without whitespace")
  }

  const branches = git("branch", ["--list"], baseDir)
    .split(/\n/)
    .map(branch => branch.replace(/^\*\s/, ""))
    .filter(Boolean)

  if (!branches.length) {
    throw new Error("No branchs found! Make sure this is a git repository")
  }

  const validatedBranch = branches.find(b => b.toLowerCase() === gitBranch.toLowerCase())

  if (!validatedBranch) {
    throw new Error(`The '${
      gitBranch
    }' branch doesn't exist in this repository.\n Check 'git branch' for the list of available branches`)
  }

  return validatedBranch
}

/**
 * Retrieves the current git branch name
 *
 * @function
 * @name getCurrentBranchName
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The current branch name (if at a git repository)
 */
function getCurrentBranchName(baseDir) {
  /* --show-current is a newer addition to Git */
  const currentBranch = git("branch", ["--show-current"], baseDir)

  if (/^Error:/i.test(currentBranch)) {
    return git("branch", ["--list"], baseDir)
      .split(/\n/)
      .filter(branch => /^\*/.test(branch))
      .map(branch => branch.replace(/^\*\s/, ""))
      .find(Boolean)
  }

  return currentBranch
}

/**
 * Get the current commit hash for a given branch
 *
 * @function
 * @name gitHashForBranch
 * @param {string} [gitBranch] The branch to retrieve the most recent hash for (defaults to the current branch)
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The commit hash for the specified branch
 */
function gitHashForBranch(gitBranch, baseDir) {
  const branch = gitBranch
    ? ensureValidGitBranch(gitBranch)
    : getCurrentBranchName(baseDir)

  return git("log", ["-n", 1, branch, "--pretty=format:%H"], baseDir)
}

/**
 * Determine the kind of semantic versioning update (major, minor, or patch) based on the conventional commit message convention (fix:, feat:, and fix!: or feat!:)
 * @function
 * @name getConventionalCommitUpdate
 * @param {string} startingBranch The branch which is the source of the current version
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The semantic version update type (ie, 'major', 'minor', 'patch') (defaults to the current branch, but that's rarely what you'd want, so usually you'll specifiy the branch)
 */
function getConventionalCommitUpdate(startingBranch, baseDir) {
  const hash = gitHashForBranch(startingBranch, baseDir)

  if (!hash) {
    return undefined
  }

  if (git("log", ["--grep=^(fix|fixed|feat|feature)!:", "-E", "-i", `${hash}^..`], baseDir)) {
    return "major"
  }
  if (git("log", ["--grep=^(feat|feature):", "-E", "-i", `${hash}^..`], baseDir)) {
    return "minor"
  }
  if (git("log", ["--grep=^(fix|fixed):", "-E", "-i", `${hash}^..`], baseDir)) {
    return "patch"
  }

  return undefined
}

module.exports = {
  git,
  gitFileContent,
  ensureValidGitBranch,
  getCurrentBranchName,
  gitHashForBranch,
  getConventionalCommitUpdate,
  isIgnoredPath,
  resolveRepoIncludedFiles
}
