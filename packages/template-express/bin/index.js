#!/usr/bin/env node
/* eslint-disable global-require */
const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")
const logger = require("../lib/consoleLogger")

/**
 * Scaffolds out the project (at a given directory) using the boilerplate files in this application's `lib/` folder.
 *
 * @function
 * @name scaffoldProject
 */
function scaffoldProject() {
  const args = process.argv.slice(2)

  try {
    if (!args.length) {
      throw new TypeError("Must include a name for the project directory")
    }

    const [projectFolderName] = args
    if (fs.existsSync(projectFolderName) && fs.readdirSync(projectFolderName).length) {
      throw new Error(`Project folder already exists: '${projectFolderName}'`)
    }

    const projectDir = path.resolve(projectFolderName)
    const folderParts = [...projectDir.split(path.sep).filter(Boolean), "lib"]

    let currentDir = "/"
    folderParts.forEach(folder => {
      if (!fs.existsSync(path.resolve(currentDir, folder))) {
        fs.mkdirSync(path.resolve(currentDir, folder))
      }
      currentDir = path.resolve(currentDir, folder)
    })

    const templateDir = path.resolve(__dirname, "../lib")

    let currentTemplateDir = templateDir
    fs.readdirSync(templateDir).forEach(fileOrFolder => {
      if (fs.statSync(path.resolve(currentTemplateDir, fileOrFolder)).isDirectory()) {
        currentTemplateDir = path.resolve(currentTemplateDir, fileOrFolder)
        fs.mkdirSync(path.resolve(currentDir, currentTemplateDir))
      } else {
        const content = fs.readFileSync(path.resolve(currentTemplateDir, fileOrFolder), "utf8")
        fs.writeFileSync(path.resolve(currentDir, fileOrFolder), content)
      }
    })

    const {
      author: _a,
      version: _v,
      license: _l,
      bin: _b,
      ...pkgJson
    } = require("../package.json")
    const eslintConfig = fs.readFileSync(path.resolve(__dirname, "..", ".eslintrc"))

    fs.writeFileSync(
      path.resolve(projectDir, "package.json"),
      JSON.stringify({
        ...pkgJson,
        name: projectFolderName.split(path.sep).filter(Boolean).reverse()[0],
        private: true,
        version: "0.0.1",
        description: "TODO"
      }, null, 2)
    )
    fs.writeFileSync(path.resolve(projectDir, ".eslintrc"), eslintConfig)

    const { status } = spawnSync("npm", ["install"], { cwd: projectDir, stdio: "inherit" })

    if (status) {
      throw new Error("Scaffolding failed‼️")
    }

    logger.info(`🚀 Finished scaffolding out the project at: '${projectFolderName}'`)

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

scaffoldProject()
