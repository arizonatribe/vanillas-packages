#!/usr/bin/env node
const logger = require("@vanillas/console-logger")
const { spawnSync } = require("child_process")

/**
 * Scaffolds out a new ExpressJs application
 *
 * @function
 * @name createExpress
 */
function createExpress() {
  try {
    const { status } = spawnSync(
      "node",
      [...process.argv.slice(2), "--template=express"],
      { stdio: "inherit" }
    )

    if (status) {
      logger.warn("Failed to create a new Express application")
      process.exit(status)
    }

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

createExpress()
