#!/usr/bin/env node

/* eslint-disable no-console, import/no-dynamic-require, global-require */
const path = require("path")
const repl = require("repl")

const modPath = require.resolve("vanillas")
const pkg = require(path.join(path.dirname(modPath), "package.json"))

console.log(`${pkg.name} ${pkg.version}`)
console.log(pkg.description)
console.log("loading . . .\n")

const V = require("vanillas")

const r = repl.start("🍦> ")

Object.defineProperty(r.context, "V", {
  configurable: false,
  enumerable: true,
  value: V
})

Object.defineProperty(r.context, "🍦", {
  configurable: false,
  enumerable: true,
  value: V
})
