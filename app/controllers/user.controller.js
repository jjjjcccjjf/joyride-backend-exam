const responseHelper = require('../helpers/responseHelper')
const redis = require('../config/redis')

const { graphql, GraphqlResponseError } = require('@octokit/graphql')
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `bearer ${process.env.GITHUB_PAT}`
  }
})

exports.list = async (req, res) => {
  const { login } = req.body

  let { __fromRedisUsers } = req.body

  const dynamicQuery = login.map(login => `${login}: user(login: "${login}") { ...UserFragment }`).join('\n')
  let data = {}
  let errors = {}

  try {
    data = await graphqlWithAuth(`
        {
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
      // handle non-GraphQL error
    }
  }

  // Delete key-value pairs that were not found
  if (data) {
    data = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null))
  }

  let formattedData = []
  for (const key in data) {
    if (data[key] !== null) {
      formattedData.push(responseHelper.formatData(data[key]))
      redis.set(key, JSON.stringify(data[key]), 'EX', 120)
    }
  }

  __fromRedisUsers = __fromRedisUsers.map(item => responseHelper.formatData(item, true))

  formattedData = formattedData.concat(__fromRedisUsers)
  // for (let key in data) {
  //     redis.set(key, JSON.stringify(data[key]), "EX", 30);
  // }

  // res.json(formattedData)
  // return;

  formattedData.sort((a, b) => {
    if (a.login < b.login) {
      return -1
    }
    if (a.login > b.login) {
      return 1
    }
    return 0
  })

  res.json(responseHelper.responseTemplate(formattedData, errors))
}
