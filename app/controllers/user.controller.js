const responseHelper = require('../helpers/response.helper')
const redis = require('../config/redis.config')

const { graphql, GraphqlResponseError } = require('@octokit/graphql')
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `bearer ${process.env.GITHUB_PAT}`
  }
})

exports.list = async (req, res) => {
  const { login } = req.body
  const { __fromRedisUsers } = req.body

  const redisData = __fromRedisUsers.map(item => responseHelper.formatData(item, true))
  const apiData = []

  let data = {}
  let errors = ''
  let mergedData = []

  if (login.length > 0) {
    const dynamicQuery = login.map(login => `${login}: user(login: "${login}") { ...UserFragment }`).join('\n')

    try {
      data = await graphqlWithAuth(`
          query {
            ${dynamicQuery}
          }
          
          fragment UserFragment on User {
            name
            login
            company
            repositories(privacy: PUBLIC) {
              totalCount
            }
            followers {
              totalCount
            }
          }`)
    } catch (error) {
      if (error instanceof GraphqlResponseError) {
        data = error.response.data
        errors = error.message
      } else {
        // Handle non-GraphQL error
        return res.status(400).json(responseHelper.responseTemplate({}, `Malformed request. ${error.message}`))
      }
    } finally {
      console.log('API call attempted')
    }
  }

  // Delete key-value pairs that were not found
  if (data) {
    data = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null))
  }

  // Remove users that were not found, format the data, and store it to redis
  for (const key in data) {
    if (data[key] !== null) {
      apiData.push(responseHelper.formatData(data[key]))
      redis.set(key, JSON.stringify(data[key]), 'EX', 120)
    }
  }

  // Merge the formatted data from redis and from the API
  mergedData = [...redisData, ...apiData]

  // Sort the data alphabetically by login/handle/username
  mergedData.sort((a, b) => {
    if (a.login < b.login) {
      return -1
    }
    if (a.login > b.login) {
      return 1
    }
    return 0
  })

  res.json(responseHelper.responseTemplate(mergedData, errors))
}
