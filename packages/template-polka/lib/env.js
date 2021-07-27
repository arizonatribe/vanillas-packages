const envalid = require("envalid")

const { bool, str, port } = envalid

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
    default: 3010,
    example: 5000,
    desc: "The port on which this application runs"
  })
}, {
  dotEnvPath: /^production$/.test(process.env.NODE_ENV)
    ? ".env.prod"
    : ".env"
})
