import * as Swagger from "hapi-swagger"
import { ServerConfig } from "../config"

/**
 * A plugin renders Swagger (OpenAPI formatted) API documentation
 *
 * @function
 * @name PluginSwagger
 * @param {ServerConfig} config The server configuration settings
 * @returns {function} A function which builds a HapiJs server configuration plugin object
 */
export function register(config: ServerConfig) {
  const { name, version, apiVersion } = config

  const swaggerOptions: Swagger.RegisterOptions = {
    info: {
      version,
      title: [name, "API Documentation"].join(" ")
    },
    basePath: `/${apiVersion}`,
    documentationPath: "/docs"
  }

  return {
    options: {
      validate: { headers: true },
      ...swaggerOptions
    },
    plugin: Swagger
  }
}
