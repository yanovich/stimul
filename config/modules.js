'use strict'

const fs = require('fs')
const path = require('path')
const paths = require('./paths')
const chalk = require('../utils/chalk')

/**
 * Get the baseUrl of a compilerOptions object.
 *
 * @param {Object} options
 */
function getAdditionalModulePaths (options = {}) {
  const baseUrl = options.baseUrl

  // We need to explicitly check for null and undefined (and not a falsy value) because
  // TypeScript treats an empty string as `.`.
  if (baseUrl == null) {
    return null
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl)

  // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
  // the default behavior.
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null
  }

  // Allow the user set the `baseUrl` to `appSrc`.
  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc]
  }

  // Otherwise, throw an error.
  throw new Error(
    chalk.red.bold(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
        ' Create React App does not support other values at this time.'
    )
  )
}

function getModules () {
  const hasJsConfig = fs.existsSync(paths.appJsConfig)

  let config

  if (hasJsConfig) {
    config = require(paths.appJsConfig)
  }

  config = config || {}
  const options = config.compilerOptions || {}

  const additionalModulePaths = getAdditionalModulePaths(options)

  return {
    additionalModulePaths: additionalModulePaths
  }
}

module.exports = getModules()
