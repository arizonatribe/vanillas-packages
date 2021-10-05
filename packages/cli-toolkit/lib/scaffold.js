const fs = require("fs")

const isObject = require("vanillas/isObject")
const identity = require("vanillas/identity")
const toTitleCase = require("vanillas/toTitleCase")
const toCamelCase = require("vanillas/toCamelCase")
const toSnakeCase = require("vanillas/toSnakeCase")
const toKebabCase = require("vanillas/toKebabCase")

const { resolvePathIfExists } = require("./paths")

const transformers = [toTitleCase, toCamelCase, toSnakeCase, toKebabCase, identity]

/**
 * Interpolates any placholders in a list of files with a set of provided values
 *
 * @function
 * @name interpolate
 * @param {Array<string>} files A list of one or more files to alter
 * @param {Object<string, string|boolean|number>} interpolationMap A map of interpolation placeholders which serves as the map of placholders to replacment values
 */
function interpolate(files, interpolationMap) {
  if (files == null) {
    throw new Error("Missing the list of file paths")
  }

  if (interpolationMap == null) {
    throw new Error("Missing the map of interpolation placeholders")
  }

  if (!Array.isArray(files)) {
    throw new TypeError("Invalid format for the list of file paths. Should be a list of file paths")
  }

  if (!isObject(interpolationMap)) {
    throw new TypeError([
      "Invalid format for the map of interpolation placeholders.",
      "Should be an object whose keys are interpolation placeholders (found throughout the files),",
      "and whose values are what you wish to replace the interpolation placeholders"
    ].join(" "))
  }

  if (files.some(f => typeof f !== "string" || !f.trim())) {
    throw new Error("One or more of the file paths are missing or in an invalid format")
  }

  if (Object.values(interpolationMap).some(v => (
    ["boolean", "number", "string"].every(type => typeof v !== type)
  ))) {
    throw new Error("The values to replace the interpolation placeholders with should be string, number or boolean")
  }

  const filesWhichDontExist = files.filter(f => !resolvePathIfExists(f))
  if (filesWhichDontExist.length) {
    throw new Error(`The following file paths do not exist:\n${filesWhichDontExist.join(/\n/)}`)
  }

  const placeholderPairs = Object.entries(interpolationMap)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const content = fs.readFileSync(file)
    let strContent = content.toString()

    placeholderPairs.forEach(([placeholder, replacementValue]) => {
      transformers.forEach(transform => {
        strContent = strContent.replace(
          new RegExp(`${transform(placeholder)}`, "g"),
          transform(replacementValue)
        )
      })
    })

    fs.writeFileSync(file, strContent)
  }
}

module.exports = { interpolate }
