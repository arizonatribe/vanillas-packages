#!/usr/bin/env node
const logger = require("@vanillas/console-logger")
const { spawnSync } = require("child_process")

/**
 * Scaffolds out a new Express TypeScript application
 *
 * @function
 * @name createExpressTypeScript
 */
function createExpressTypeScript() {
  try {
    const { status } = spawnSync(
      "node",
      [...process.argv.slice(2), "--template=express-typescript"],
      { stdio: "inherit" }
    )

    if (status) {
      logger.warn("Failed to create a new Express TypeScript application")
      process.exit(status)
    }

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

createExpressTypeScript()
