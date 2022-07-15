import * as Swagger from "hapi-swagger"
import { ServerConfig } from "../config"

export default function createPlugin(config: ServerConfig) {
  const { name, version, apiVersion } = config

  const swaggerOptions: Swagger.RegisterOptions = {
    info: {
      title: [name, "API Documentation"].join(" "),
      version: version
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
