const fs = require("./fs")
const git = require("./git")
const args = require("./args")
const paths = require("./paths")
const scaffold = require("./scaffold")

module.exports = { ...args, ...paths, ...scaffold, ...git, ...fs }
