import { ServerRoute } from "@hapi/hapi"
import { controller, Controller, get, validate } from "hapi-decorators"

export interface HealthCheckResponse {
  status: number
  message: string
  uptime: number
  timestamp: number
  appName: string
  appVersion: string
}

export interface BasicControllerConfig {
  name: string
  version: string
}

@controller("/")
export class BasicController implements Controller {
  baseUrl!: string
  appName: string
  appVersion: string
  routes!: () => ServerRoute[]

  constructor(config: BasicControllerConfig) {
    this.appName = config.name
    this.appVersion = config.version
  }

  @validate({ headers: true })
  @get("/healthcheck")
  public async healthCheck(): Promise<HealthCheckResponse | void> {
    return {
      appName: this.appName,
      appVersion: this.appVersion,
      uptime: process.uptime(),
      timestamp: Date.now(),
      message: "OK",
      status: 200
    }
  }
}
