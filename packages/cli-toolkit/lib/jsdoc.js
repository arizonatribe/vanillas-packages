/* eslint-disable no-console */
const fs = require("fs")
const path = require("path")
const { execFileSync } = require("child_process")

/**
 * Resolves the JSDoc binary location (if exists)
 *
 * @function
 * @name resolveJsDocBin
 * @throws {Error} When unable to resolve the JSDoc binary
 * @param {string} [cwd=process.cwd()] The directory from which to check for the install JSDoc binary
 * @returns {string} The relative or absolute path to the JSDoc binary
 */
function resolveJsDocBin(cwd) {
  if (fs.existsSync(path.resolve(cwd || process.cwd(), "node_modules/.bin/jsdoc"))) {
    return path.resolve(cwd || process.cwd(), "node_modules/.bin/jsdoc")
  }

  try {
    const output = execFileSync("jsdoc", ["-v"]).toString()

    if (!output) {
      throw new Error(output)
    }

    return "jsdoc"
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error([
        "It doesn't look like JSDoc is installed",
        cwd ? ` at:\n  ${cwd}` : undefined,
        "\nPlease install it via:\n  npm install --save-dev jsdoc"
      ].filter(Boolean).join(""))
    }
    throw err
  }
}

/**
 * @typedef {Object<string, any>} JSDocAst
 * @property {string} name
 * @property {string} longname
 * @property {string} description
 * @property {string} comment
 * @property {string} scope
 * @property {string} kind
 * @property {Array<Object<string, any>>} [params]
 * @property {Array<Object<string, any>>} [returns]
 */

/**
 * Parses the JSDoc comments from a given file
 *
 * @function
 * @name parseJsDocAst
 * @param {string} filePath The path to the JavaScript file itself
 * @param {string} [jsDocBin=jsdoc] The path to the JSDoc binary
 * @returns {Array<JSDocAst>} The list of JSDoc comments ASTs in the file
 */
function parseJsDocAst(filePath, jsDocBin) {
  let output

  if (!jsDocBin) {
    jsDocBin = resolveJsDocBin()
  }

  try {
    output = execFileSync(jsDocBin, ["-X", filePath]).toString()
  } catch (err) {
    console.error(err)
    throw new Error(`JSDoc couldn't read in the file at: ${filePath}`)
  }

  let asts

  try {
    asts = JSON.parse(output)
  } catch (err) {
    console.error(err)
    throw new Error(`Unable to parse the content of the file at: ${filePath}`)
  }

  return (asts || []).filter(a => a.comment)
}


/**
 * Parses the JSDoc comments from all the JavaScript files at given directory
 *
 * @function
 * @name parseJsFiles
 * @param {string} [dir=process.cwd()] The path to the JavaScript files
 * @param {boolean} [debug=false] Whether to log/debug to the console the progress of parsing the files
 * @returns {Array<JSDocAst>} The list of JSDoc comments ASTs in the file
 */
function parseJsFiles(dir = process.cwd(), debug = false) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error("Must provide a directory where JavaScript files can be found")
  }

  const filePaths = fs.readdirSync(dir).filter(f => /\.js$/.test(f)).map(f => path.resolve(dir, f))

  if (!filePaths.length) {
    throw new Error(`No JavaScript files were found at: ${dir}`)
  }

  const asts = []
  const jsDocBin = resolveJsDocBin()
  const log = debug ? console.debug : () => {}
  const len = filePaths.length

  log(`Parsing ${len} files`)

  for (let f = 0; f < len; f++) {
    log(`Reading ${filePaths[f].split(path.sep).slice(-1)}`)
    const ast = parseJsDocAst(filePaths[f], jsDocBin)
    log(`Finished parsing comments from ${filePaths[f].split(path.sep).slice(-1)}`)
    asts.push(ast)
  }

  return asts
}

module.exports = {
  resolveJsDocBin,
  parseJsDocAst,
  parseJsFiles
}
