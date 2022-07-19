# Args

Parse command-line args into an object

# Installation

```bash
npm install @vanillas/args
```

# Usage

Use it to parse Node's `process.argv` command-line arguments. The args are placed onto an object and if necessary for any args they are coerced to an array of values.

```javascript
#/usr/bin/env node
const { spawnSync } = require("child_process")

const logger = require("@vanillas/console-logger")
const parseArgs = require("@vanillas/args")

/**
 * An example shell script written for NodeJs.
 * Demonstrates parsing of command-line args, logging, spawning additional commands, etc.
 */
function run() {
  try {
    const options = parseArgs(process.argv.slice(2))

    if (options.help || options.h) {
      console.log(`
      A CLI tool which does many cool things.

      Options:
        --cwd         The current working directory
        --log-level   Logging threshold level
        --out-dir     The output directory

      Usage:
      $ my-cli-tool build --cwd=../ --out-dir ./build
      $ my-cli-tool start --log-level=debug --cwd=$HOME
      $ my-cli-tool reset
      `)
      process.exit(0)
    }

    const { _: command } = options

    logger.setLevel = /^(trace|debug|info|warn|error|fatal)$/i.test(options.logLevel)
      ? options.logLevel.toLowerCase()
      : "info"

    logger.debug(options)

    const cwd = options.cwd || process.cwd()

    if (!fs.existsSync(cwd)) {
      throw new Error(`The directory does not exist at '${cwd}'`)
    }
    if (!fs.statSync(cwd).isDirectory()) {
      throw new Error(`The cwd should be a directory and not a file '${cwd}'`)
    }

    const spawnOptions = { cwd, stdio: "inherit" }

    logger.info(`Running the '${command}' command`)

    const startedAt = Date.now()

    let result = { status: 0 }

    if (command === "build") {
      const args = ["run", "build"]

      if (options.outDir) {
        args.push("--")
        args.push("--outDir")
        args.push(options.outDir)
      }

      result = spawnSync("npm", args, spawnOptions)
    } else {
      result = spawnSync("npm", ["run", command], spawnOptions)
    }

    if (result.status > 0) {
      logger.error(`Failed to run the '${command}' command`)
      process.exit(result.status)
    }

    const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed("2")

    logger.debug(`Finished executing the '${command}' in ${elapsedSeconds} seconds⏱`)

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

run()
```
