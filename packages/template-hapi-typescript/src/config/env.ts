import dotenv from "dotenv"
import * as envalid from "envalid"
import { Level } from "pino"

const { bool, str, port } = envalid

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
export interface ServerEnv {
  PRETTY_PRINT: boolean
  HOST: string
  NODE_ENV: "development" | "production"
  LOG_LEVEL: Level
  PORT: number
}

/**
 * Parses, validates, and sets optional defaults for the Node `process.env` environment variables config object.
 *
 * @function
 * @name parseEnv
 * @throws {Error} When the environment variables fail schema validation
 * @returns {ServerEnv} The enhanced `process.env` based config object
 */
export default function parseEnv() {
  const dotEnvPath = /^production$/.test(process.env.NODE_ENV as string)
    ? ".env.prod"
    : ".env"

  const result = dotenv.config({ path: dotEnvPath })

  if (result.error) {
    throw result.error
  }

  return envalid.cleanEnv<ServerEnv>(process.env, {
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
}
