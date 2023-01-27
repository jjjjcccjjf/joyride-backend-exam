/**
 *
 * @param {object} data - Data from redis or github API we put in the `data` key
 * @param {string} errors - Error message
 * @returns {object} - Returns an object containing the response template
 */
function responseTemplate (data, errors) {
  // block of code for counting the response data
  let dataLength = 0
  if (data instanceof Array) {
    dataLength = data.length
  } else if (data instanceof Object) {
    if (Object.keys(data).length === 0) {
      dataLength = 0
    } else {
      dataLength = 1
    }
  }

  // return our new structure for the response
  return {
    data,
    meta: {
      errors,
      totalRows: dataLength
    }
  }
}

/**
 *
 * @param {object} data - The default data structure from the API
 * @param {bool} fromCache - Specifies if the data is from the redis cache or not
 * @returns {object} - Returns the data in our preferred format
 */
function formatData (data, fromCache = false) {
  return {
    name: data.name,
    login: data.login,
    company: data.company,
    repo_count: data.repositories.totalCount,
    followers_count: data.followers.totalCount,
    avg_followers_count: data.followers.totalCount / data.repositories.totalCount,
    fromCache
  }
}

const responseHelper = {
  responseTemplate,
  formatData
}

module.exports = responseHelper
