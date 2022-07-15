/* eslint-disable global-require, import/no-dynamic-require */
const fs = require("fs")
const path = require("path")
const prompts = require("prompts")
const { spawnSync } = require("child_process")
const logger = require("@vanillas/console-logger")

const templates = [
  { title: "Express (JavaScript)", value: "express" },
  { title: "Express (TypeScript)", value: "express-typescript" },
  { title: "Hapi (TypeScript)", value: "hapi-typescript" },
  { title: "Polka (JavaScript)", value: "polka" }
]

/**
 * Cancels the scaffolding
 *
 * @function
 * @name onCancel
 */
function onCancel() {
  logger.warn("Canceled creation of a new app")
  process.exit(0)
}

/**
 * Collects configuration values from the user for a new app to be scaffolded
 *
 * @function
 * @name promptForAppDetails
 * @param {object} defaults The default values which the user may have passed in via CLI flags
 * @returns {Promise<object>} The collected values
 */
async function promptForAppDetails(defaults = {}) {
  const options = {
    ...(defaults.appName && {
      appName: defaults.appName.trim().replace(/\s/g, "-")
    }),
    ...(templates.some(t => t.value === defaults.template) && {
      template: defaults.template
    })
  }

  if (!options.appName) {
    ({ appName: options.appName } = await prompts([{
      type: "text",
      name: "appName",
      message: "What will be the name of your app?",
      format: val => (val || "").trim().replace(/\s/g, "-"),
      validate: val => !/^\s*$/.test(val)
    }], { onCancel }))
  }

  if (!defaults.appName) {
    ({ projectFolder: options.projectFolder } = await prompts([{
      type: "text",
      name: "projectFolder",
      initial: path.resolve(options.appName),
      message: "Where should the app be located?",
      format: val => path.resolve((val || "").trim().replace(/\s/g, "-")),
      validate: val => !/^\s*$/.test(val)
    }], { onCancel }))
  } else {
    options.projectFolder = path.resolve(options.appName)
  }

  if (!options.template) {
    ({ template: options.template } = await prompts([{
      type: "select",
      name: "template",
      message: "What kind of app are you creating?",
      choices: templates
    }], { onCancel }))
  }

  return options
}

/**
 * Creates a package.json manifest from the template and other environment details as a base
 *
 * @function
 * @name buildPackageJson
 * @param {string} sourceDir The source folder containing the package.json
 * @param {string} destinationDir The destination folder where the new package.json will be created
 * @param {string} [appName] The name of the new app (otherwise will use the name of the template, and that's probably rarely - if ever - wanted)
 */
function buildPackageJson(sourceDir, destinationDir, appName) {
  const pkgJson = require(path.resolve(sourceDir, "package.json"))

  let author = ""
  try {
    for (const val of ["name", "email"]) {
      const { output: userOutput } = spawnSync("git", ["config", `user.${val}`])
      const parsedUserVal = userOutput.toString().replace(/,/g, "").replace(/\n/g, "")
      author = [
        author,
        author && val === "email" ? " <" : " ",
        parsedUserVal,
        author && val === "email" ? ">" : ""
      ].filter(Boolean).join("").trim()
    }
  } catch (e) {
    logger.warn(e)
  }

  fs.writeFileSync(
    path.resolve(destinationDir, "package.json"),
    JSON.stringify({
      name: pkgJson.name,
      ...(appName && {
        name: appName
          .split(path.sep)
          .filter(Boolean)
          .reverse()[0]
      }),
      // TODO: Supportither 'module' or 'commonjs'
      // type: "commonjs",
      author,
      private: true,
      version: "0.0.1",
      description: "TODO",
      license: "UNLICENSED",
      ...["main", "engines", "scripts", "dependencies", "devDependencies", "peerDependencies"]
        .filter(prop => pkgJson[prop] != null)
        .reduce((obj, prop) => ({ ...obj, [prop]: pkgJson[prop] }), {})
    }, null, 2)
  )
}

/**
 * Copies files/folders (recursively) from a source directory to a destination directory
 *
 * @function
 * @name generateFiles
 * @param {string} sourceDir The source folder
 * @param {string} destinationDir The destination folder
 */
function generateFiles(sourceDir, destinationDir) {
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir)
  }

  fs.readdirSync(sourceDir)
    .filter(v => !/^(node_modules|LICENSE|README.md|package-lock.json)/.test(v))
    .forEach(fileOrFolder => {
      if (fs.statSync(path.resolve(sourceDir, fileOrFolder)).isDirectory()) {
        generateFiles(path.resolve(sourceDir, fileOrFolder), path.resolve(destinationDir, fileOrFolder))
      } else {
        const content = fs.readFileSync(path.resolve(sourceDir, fileOrFolder), "utf8")
        fs.writeFileSync(path.resolve(destinationDir, fileOrFolder), content)
      }
    })
}

module.exports = {
  promptForAppDetails,
  buildPackageJson,
  generateFiles
}
