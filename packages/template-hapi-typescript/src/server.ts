/* eslint-disable no-console */
import "reflect-metadata"
import { Logger } from "pino"
import createApp from "./app"

async function startServer() {
  let logger: Console | Logger = console

  try {
    const { server, config, services } = await createApp()

    const { port, name, level, isProduction, apiVersion, version } = config

    if (services.logger) {
      logger = services.logger
    }

    await server.start()

    if (["trace", "debug", "info"].some(l => l === level)) {
      logger.info(`🌳 Logging level set to: "${level}"`)
      logger.info(`🚀 ${name}-${
        isProduction ? "prod" : "dev"
      } (${version}) now running on port ${port} at /${apiVersion}`)
    }
  } catch (err: any) {
    logger.error(err)
    process.exit(1)
  }
}

startServer()
