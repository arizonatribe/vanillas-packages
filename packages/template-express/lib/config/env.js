const dotenv = require("dotenv")
const envalid = require("envalid")

const { bool, str, port } = envalid

const dotEnvPath = /^production$/.test(process.env.NODE_ENV)
  ? ".env.prod"
  : ".env"

const result = dotenv.config({ path: dotEnvPath })

if (result.error) {
  throw result.error
}

/**
 * The minimum expected environment variables
 *
 * @interface
 * @typedef {Object<string, number|boolean|string>} ServerEnv
 * @property {boolean} [PRETTY_PRINT=false] Whether or not to format the stdout/stderr logs in a visually styled manner (mainly for local development).
 * @property {string} [HOST=localhost] The host/hostname for the application (without the transport protocol prefix)
 * @property {string} [NODE_ENV=development] The environment where this application is running
 * @property {string} [LOG_LEVEL=info] The logging threshold level
 * @property {number} [PORT=5000] The port on which this application runs
 */
module.exports = envalid.cleanEnv(process.env, {
  PRETTY_PRINT: bool({
    default: false,
    desc: "Whether or not to format the stdout/stderr logs in a visually styled manner (mainly for local development)."
  }),
  HOST: str({
    desc: "The host/hostname for the application (without the transport protocol prefix)",
    default: "localhost"
  }),
  NODE_ENV: str({
    desc: "The environment where this application is running",
    default: "development",
    choices: ["development", "production"]
  }),
  LOG_LEVEL: str({
    default: "info",
    desc: "The logging threshold level",
    choices: ["trace", "debug", "info", "warn", "error", "fatal"]
  }),
  PORT: port({
    default: 5000,
    example: "5000",
    desc: "The port on which this application runs"
  })
})
