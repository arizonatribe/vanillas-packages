#!/usr/bin/env node
const logger = require("@vanillas/console-logger")
const { spawnSync } = require("child_process")

/**
 * Scaffolds out a new Hapi TypeScript application
 *
 * @function
 * @name createHapiTypeScript
 */
function createHapiTypeScript() {
  try {
    const { status } = spawnSync(
      "node",
      [...process.argv.slice(2), "--template=hapi-typescript"],
      { stdio: "inherit" }
    )

    if (status) {
      logger.warn("Failed to create a new Hapi TypeScript application")
      process.exit(status)
    }

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

createHapiTypeScript()
