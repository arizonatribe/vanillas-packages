import pino, { Logger } from "pino"
import { ServerConfig } from "../config"

/**
 * Creates a threshold based logger.
 * It mirrors the methods of JavaScript's native `console` API, but whose events are only written to stderr/stdout based on a configured logging threshold.
 *
 * @function
 * @name createLogger
 * @param {ServerConfig} config The server configuration settings
 * @returns {Logger} An instance of the [Pino](https://www.npmjs.com/package/pino) threshold logger
 */
export function createLogger(config: ServerConfig) {
  const { name, version, level, shouldPrettyPrint } = config
  const logger = pino({
    level,
    prettyPrint: shouldPrettyPrint,

    /* Add any additional redaction field paths or replace with a function which builds a list of them */
    redact: [
      "token",
      "password",
      "access_token",
      "client_secret"
    ],
    name: [name, version].join("@")
  })

  return logger
}

export type { Logger }
