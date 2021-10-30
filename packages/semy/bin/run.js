#!/usr/bin/env node
/* eslint-disable global-require, no-inner-declarations, import/no-dynamic-require */
const fs = require("fs")
const path = require("path")
const semver = require("semver")
const prompts = require("prompts")
const logger = require("@vanillas/chalk-console-logger")
const {
  git,
  parseArgs,
  gitFileContent,
  ensureValidGitBranch,
  getCurrentBranchName
} = require("@vanillas/cli-toolkit")

/**
 * A semantic versioning validation error
 *
 * @class
 * @name SemverError
 * @augments TypeError
 */
class SemverError extends TypeError {
  constructor(message, data) {
    super(message)
    this.name = this.constructor.name
    this.data = data || {}
  }
}

/**
 * Gets the branch name to use as the remote basis
 *
 * @function
 * @name getBranch
 * @param {string} [gitBranch] The branch name to validate (defaults to
 * 'develop')
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string} Gets the validated branch name
 */
function getBranch(gitBranch, baseDir) {
  let fallbackBranch

  if (!gitBranch) {
    try {
      fallbackBranch = ensureValidGitBranch("develop", baseDir)
    } catch (err) {
      fallbackBranch = getCurrentBranchName(baseDir)
    }
  }

  return ensureValidGitBranch(gitBranch || fallbackBranch, baseDir)
}

/**
 * Interactively version a NodeJs project
 *
 * @function
 * @name semy
 */
async function semy() {
  const options = parseArgs(process.argv.slice(2))

  if (options.h === true || options.help === true) {
    /* eslint-disable max-len */
    logger.info(chalk => chalk`
{bold.green Set a semantic version value onto the }{cyan package.json }{bold.green for a NodeJs project (directly or interactively)}

{bold.green Options:}
  {bold.yellow --type}           The kind of semantic version increment. Choices are {cyan patch} (default), {cyan minor}, or {cyan major}.
  {bold.yellow --branch}         The branch to use as the basis for the current version.
                   Rare that this need be anything other than {cyan develop} (default) for NodeJs projects
                   (except for single branch projects).
  {bold.yellow --revert}         Set the {cyan version} field in the local {yellow package.json} to match that of the source branch
                   (specified by {cyan --branch}, defaulting to {yellow develop})
  {bold.yellow --info}           Maybe you only want to compare the local {cyan package.json} with that of a branch and see what the major/minor/patch updates would be.
  {bold.yellow --cwd}            An optional working directory to specific (defaults to the directory where the script is being executed)
  {bold.yellow --dry-run}        To do everything except for actually altering the {cyan package.json}
  {bold.yellow --log-level}      The threshold logging leve to use (defaults to {cyan info}).

{bold.yellow Examples}
  {bold.gray $ }{bold.cyan semy }
  {bold.gray $ }{bold.cyan semy }{bold.green 1.17.0}
  {bold.gray $ }{bold.cyan semy }{bold.yellow --type}={red minor}
  {bold.gray $ }{bold.cyan semy }{bold.yellow --type}={red major}
  {bold.gray $ }{bold.cyan semy }{bold.yellow --type}={red patch}
  {bold.gray $ }{bold.cyan semy }{bold.yellow --revert}
  {bold.gray $ }{bold.cyan semy }{bold.yellow --info}
  {bold.gray $ }{bold.cyan semy }{bold.yellow --cwd}={red ../path/to/some/other/repo}
    `)
    /* eslint-enable max-len */
    process.exit(0)
  }

  try {
    logger.setLevel(options.logLevel || "info")
    logger.debug(options)

    const cwd = options.cwd != null
      ? path.resolve(options.cwd)
      : process.cwd()

    const { _: forceVersion } = options

    if (forceVersion != null && !semver.valid(forceVersion)) {
      throw new SemverError(`Not a valid semantic version: '${forceVersion}'`)
    }

    if (options.type && !/^(patch|minor|major)$/i.test(options.type)) {
      throw new SemverError("The --type flag should be one of: 'major', 'minor', or 'patch'")
    }

    /* To keep a clean set of CLI options, not going to advertise these, but will adapt if they're used instead */
    if (options.type == null && (options.patch || options.minor || options.major)) {
      options.type = [
        options.patch && "patch",
        options.minor && "minor",
        options.major && "major"
      ].find(Boolean)
    }

    const branch = getBranch(options.branch, cwd)
    const pkgJsonRepoPath = git("ls-files", ["--full-name", path.resolve(cwd, "package.json")], cwd)
    const pkg = gitFileContent(pkgJsonRepoPath, branch, cwd)

    if (pkg == null) {
      throw new Error(
        `Unable to find the package.json at the '${branch}' branch for this project`
      )
    }

    if (typeof pkg !== "object" || !Object.keys(pkg).length) {
      throw new SemverError(
        `The package.json at the '${branch}' branch for this project is not in valid JSON format`,
        { pkg }
      )
    }

    const currentVersion = semver.valid(pkg.version)

    if (!currentVersion) {
      throw new SemverError(
        `The version on the ${branch} branch's package.json is invalid: '${pkg.version}'`,
        { version: currentVersion }
      )
    }

    const localPkg = require(path.resolve(cwd, "./package.json"))

    if (!semver.valid(localPkg.version)) {
      throw new SemverError(
        `The version on the local package.json is invalid: '${localPkg.version}'`,
        { currentVersion, newVersion: localPkg.version }
      )
    }

    /**
     * Sets the new version on the local package.json, logs it to the console and exits
     *
     * @function
     * @private
     * @name setVersionAndExit
     * @param {string} ver The semantic version value to set on the local package.json
     */
    function setVersionAndExit(ver) {
      localPkg.version = ver

      if (!options.dryRun) {
        fs.writeFileSync(path.resolve(cwd, "./package.json"), JSON.stringify(localPkg, null, 2))
      }

      if (currentVersion === ver) {
        logger.info(chalk => chalk`Reverted local version back to match the current version of the {yellow ${
          branch
        }} branch of {red ${
          currentVersion
        }} ✅`)
      } else {
        logger.info(chalk => chalk`Changed version for {yellow ${
          localPkg.name
        }} from {red ${
          currentVersion
        }} to {green ${
          ver
        }} ✅`)
      }

      process.exit(0)
    }

    if (forceVersion != null) {
      setVersionAndExit(forceVersion)
    }

    if (options.revert) {
      setVersionAndExit(currentVersion)
    }

    if (options.type == null && currentVersion !== localPkg.version) {
      logger.info(chalk => chalk`The current version on the ${
        branch
      } branch is \n  {red ${
        currentVersion
      }}\nbut it looks like the new version has already been set locally to:\n  {green ${
        localPkg.version
      }}.\nYou can {yellow --revert} to start fresh,\nor just pass in the version you wish to set directly.`)

      process.exit(0)
    }

    const currentMajor = semver.major(currentVersion)
    const currentMinor = semver.minor(currentVersion)
    const currentPatch = semver.patch(currentVersion)

    const majorChange = [currentMajor + 1, 0, 0].join(".")
    const minorChange = [currentMajor, currentMinor + 1, 0].join(".")
    const patchChange = [currentMajor, currentMinor, currentPatch + 1].join(".")

    const summary = {
      package: localPkg.name,
      "Local package.json": localPkg.version,
      [`${branch} branch's package.json`]: pkg.version,
      "versioning options:": {
        Major: majorChange,
        Minor: minorChange,
        Patch: patchChange
      }
    }

    if (options.info) {
      logger.info(summary)
      process.exit(0)
    }

    logger.debug(summary)


    let newVersion
    /* Jump into interactive mode, if the --type flag wasn't used */
    if (options.type == null) {
      const choices = [
        semver.valid(patchChange) && {
          title: `Patch (${patchChange})`,
          description: "Backward compatible bug fixes",
          value: patchChange
        },
        semver.valid(minorChange) && {
          title: `Minor (${minorChange})`,
          description: "Backward compatible new features",
          value: minorChange
        },
        semver.valid(majorChange) && {
          title: `Major (${majorChange})`,
          description: "Changes that break backward compatibility",
          value: majorChange
        }
      ].filter(Boolean);

      ({ newVersion } = await prompts([{
        type: "select",
        name: "newVersion",
        format(v) {
          return v.replace(/\s/g, "")
        },
        initial: 0,
        choices,
        message: "Please select the type of semantic versioning change to make:"
      }]))
    } else {
      newVersion = /^major$/i.test(options.type)
        ? majorChange
        : /^minor$/i.test(options.type)
          ? minorChange
          : patchChange
    }

    if (!newVersion) {
      throw new SemverError("No new semantic version was selected")
    }

    if (newVersion === currentVersion) {
      throw new SemverError("The new version is the same as the old one")
    }

    if (!semver.valid(newVersion)) {
      throw new SemverError(`Semantic version to be updated is not valid: ${newVersion}`)
    }

    setVersionAndExit(newVersion)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

semy()
