import pino, { Logger } from "pino"
import { ServerConfig } from "../config"

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
