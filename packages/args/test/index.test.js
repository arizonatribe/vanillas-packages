/* global it */
const assert = require("assert")
const { parseArgs } = require("../lib")

it("parse full process.argv and pluck out values", () => {
  const rawArgs = ["--cwd=../", "--log-level", "debug"]
  const options = parseArgs(rawArgs)
  assert.deepEqual(options, { cwd: "../", logLevel: "debug" })
})

it("coerce args to array (when necessary)", () => {
  const rawArgs = ["--extensions", ".js", ".ts", ".jsx", ".tsx", "--debug"]
  const options = parseArgs(rawArgs)
  assert.deepEqual(options, { extensions: [".js", ".ts", ".jsx", ".tsx"], debug: true })
})

it("converts numeric values", () => {
  const rawArgs = ["--age=21", "--level", "20"]
  const options = parseArgs(rawArgs)
  assert.deepEqual(options, { age: 21, level: 20 })
})

it("groups stray arg values to the root '_' arg", () => {
  const rawArgs = ["run", "build", "--out-dir", "."]
  const options = parseArgs(rawArgs)
  assert.deepEqual(options, { _: ["run", "build"], outDir: "." })
})

it("the root '_' arg is always an array", () => {
  const rawArgs = ["build"]
  const options = parseArgs(rawArgs)
  assert.deepEqual(options, { _: ["build"] })
})
