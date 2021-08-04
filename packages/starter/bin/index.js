#!/usr/bin/env node
/* eslint-disable global-require, import/no-dynamic-require */
const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")
const logger = require("@vanillas/console-logger")
const { parseArgs } = require("@vanillas/cli-toolkit")
const { promptForAppDetails, buildPackageJson, generateFiles } = require("../lib")

/**
 * Scaffolds out the project (at a given directory) using the boilerplate files for a given NodeJs template package
 *
 * @function
 * @name scaffoldProject
 */
async function scaffoldProject() {
  const options = parseArgs(process.argv.slice(2))

  try {
    const { appName, projectFolder, template } = await promptForAppDetails({ appName: options[0], ...options })

    if (fs.existsSync(projectFolder) && fs.readdirSync(projectFolder).length) {
      throw new Error(`Project folder already exists: '${projectFolder}'`)
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

    buildPackageJson(templateDir, projectFolder, appName)

    const { status } = spawnSync("npm", ["install"], { cwd: projectFolder, stdio: "inherit" })

    if (status) {
      throw new Error("Installing NPM dependencies failed‼️")
    }

    logger.info(`🚀 Finished scaffolding out '${appName}' at:\n '${projectFolder}'`)

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

scaffoldProject()
