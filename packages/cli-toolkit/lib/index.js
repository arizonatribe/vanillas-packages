const fs = require("./fs")
const git = require("./git")
const args = require("@vanillas/args")
const paths = require("./paths")
const jsdoc = require("./jsdoc")
const scaffold = require("./scaffold")

module.exports = { ...args, ...paths, ...scaffold, ...git, ...fs, ...jsdoc }
