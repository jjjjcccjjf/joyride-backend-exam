/**
 *
 * @param {object} data - Data from redis or github API we put in the `data` key
 * @param {string} errors - Error message
 * @returns {object} - Returns an object containing the response template with meta information
 */
function responseTemplate (data, errors) {
  // Block of code for counting the response data
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

  // Return our preferred response structure
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
 * @returns {object} - Returns a data item in our preferred format
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
