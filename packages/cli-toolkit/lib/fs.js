const fs = require("fs-extra")
const path = require("path")
const { resolveGlobIfExists, resolvePathIfExists } = require("./paths")

/**
 * Copies a source folder to a destination path (overwriting anything already existing at the destination)
 *
 * @function
 * @name copyFolder
 * @param {string} srcPath The source folder to be copied
 * @param {string} destPath The desination folder where the source folder is being copied to
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string} The full (absolute) desination path where the copying completed
 */
function copyFolder(srcPath, destPath, baseDir) {
  const resolvedPath = resolvePathIfExists(srcPath, baseDir)
  if (fs.statSync(resolvedPath).isDirectory()) {
    fs.copySync(resolvedPath, destPath, { overwrite: true })
    return resolvePathIfExists(destPath, baseDir)
  }
  return undefined
}

/**
 * Copies a folder nested nested inside one or more packages folders
 *
 * @function
 * @name copyNestedPackagesFolder
 * @throws {Error} When the packages folder doesn't exist
 * @throws {Error} When no nested folders are found in the packages folder
 * @param {string} [packagesFolder=packages] The packages sub-folder name (defaults to ./packages)
 * @param {string} [nestedFolder=docs] The folder nested across one or more packages folders
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {Array<string>} The list of copied (absolute) paths
 */
function copyNestedPackagesFolder(packagesFolder = "packages", nestedFolder = "docs", baseDir) {
  if (!nestedFolder || /^\s*$/.test(nestedFolder)) {
    throw new Error("Missing the nested folder")
  }

  const existingPackagesFolder = resolvePathIfExists(packagesFolder, baseDir)

  if (!existingPackagesFolder) {
    throw new Error(`Unable to find packages at: ${packagesFolder}`)
  }

  const pattern = `${packagesFolder.replace(/\/$/, "")}/*/${nestedFolder}`
  const absFolders = resolveGlobIfExists(pattern, baseDir)
    .map(f => f.replace(new RegExp(`${existingPackagesFolder}\\/?/`), ""))

  if (!absFolders.length) {
    throw new Error(`Unable to find ${nestedFolder} folders nested in the packages folder via: ${pattern}`)
  }

  const copiedPaths = []

  absFolders.forEach(docsPath => {
    const newPath = path.resolve(baseDir || process.cwd(), nestedFolder, docsPath.split(path.sep)[0])
    copiedPaths.push(newPath)
    copyFolder(path.resolve(existingPackagesFolder, docsPath), newPath, baseDir)
  })

  return copiedPaths
}

/**
 * Renames a given file/folder path if it exists
 *
 * @function
 * @name renameIfExists
 * @param {string} oldPath The existing file/folder location
 * @param {string} newPath The new file/folder location
 * @param {string} [baseDir=process.cwd()] The base directory from which to resolve any relative file paths
 * @returns {string|undefined} The renamed file/folder path (or undefined if it did not exist to begin with)
 */
function renameIfExists(oldPath, newPath, baseDir) {
  const resolvedPath = resolvePathIfExists(oldPath, baseDir)
  if (resolvedPath) {
    fs.moveSync(oldPath, newPath, { overwrite: true })
    return resolvePathIfExists(newPath, baseDir)
  }

  return undefined
}

module.exports = {
  copyFolder,
  renameIfExists,
  copyNestedPackagesFolder
}
