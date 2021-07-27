const app = require("./app")
const config = require("./config")

const { port, name, level, isProduction, apiVersion, version } = config

app.listen(port, "0.0.0.0", () => {
  if (["trace", "debug", "info"].some(l => l === level)) {
    /* eslint-disable no-console */
    console.log(`🌳 Logging level set to: "${level}"`)
    console.log(`🚀 ${name}-${
      isProduction ? "prod" : "dev"
    } (${version}) now running on port ${port} at /${apiVersion}`)
  }
})
