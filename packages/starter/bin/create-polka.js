#!/usr/bin/env node
const logger = require("@vanillas/console-logger")
const { spawnSync } = require("child_process")

/**
 * Scaffolds out a new PolkaJs application
 *
 * @function
 * @name createPolka
 */
function createPolka() {
  try {
    const { status } = spawnSync(
      "node",
      [...process.argv.slice(2), "--template=polka"],
      { stdio: "inherit" }
    )

    if (status) {
      logger.warn("Failed to create a new Polka application")
      process.exit(status)
    }

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

createPolka()
