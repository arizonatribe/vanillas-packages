#!/usr/bin/env node
/* eslint-disable global-require, import/no-dynamic-require */
const fs = require("fs")
const path = require("path")
const prompts = require("prompts")
const { spawnSync } = require("child_process")
const logger = require("@vanillas/console-logger")
const { parseArgs } = require("@vanillas/cli-toolkit")

const templates = [
  { title: "ExpressJs", value: "express" },
  { title: "PolkaJs", value: "polka" }
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
 * @name inputPrompt
 * @param {object} defaults The default values which the user may have passed in via CLI flags
 * @returns {Promise<object>} The collected values
 */
async function inputPrompt(defaults = {}) {
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

/**
 * Scaffolds out the project (at a given directory) using the boilerplate files for a given NodeJs template package
 *
 * @function
 * @name scaffoldProject
 */
async function scaffoldProject() {
  const options = parseArgs(process.argv.slice(2))

  try {
    const { appName, projectFolder, template } = await inputPrompt({ appName: options[0], ...options })

    if (fs.existsSync(projectFolder) && fs.readdirSync(projectFolder).length) {
      throw new Error(`Project folder already exists: '${appName}'`)
    }

    let templateDir
    try {
      const templateFullName = `template-${template.replace(/^template-?/, "")}`
      const resolvedTemplateMain = require.resolve(`@vanillas/${templateFullName}`)
      const [templateBasePath] = resolvedTemplateMain.split(templateFullName)
      templateDir = path.resolve(templateBasePath, templateFullName)
    } catch (e) {
      logger.warn(e)
      throw new Error(`Unable to find a template matching name '${template}'`)
    }

    generateFiles(templateDir, projectFolder)

    const {
      author: _a,
      version: _v,
      license: _l,
      bin: _b,
      ...pkgJson
    } = require(path.resolve(templateDir, "package.json"))

    fs.writeFileSync(
      path.resolve(projectFolder, "package.json"),
      JSON.stringify({
        ...pkgJson,
        ...(appName && {
          name: appName
            .split(path.sep)
            .filter(Boolean)
            .reverse()[0]
        }),
        private: true,
        version: "0.0.1",
        description: "TODO"
      }, null, 2)
    )

    const { status } = spawnSync("npm", ["install"], { cwd: projectFolder, stdio: "inherit" })

    if (status) {
      throw new Error("Scaffolding failed‼️")
    }

    logger.info(`🚀 Finished scaffolding out '${appName}' at:\n '${projectFolder}'`)

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

scaffoldProject()
