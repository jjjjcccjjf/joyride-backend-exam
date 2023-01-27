function responseTemplate (data, errors) {
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

  return {
    data,
    meta: {
      errors,
      totalRows: dataLength
    }
  }
}

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
