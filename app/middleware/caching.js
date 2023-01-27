const redis = require('../config/redis.config')

const redisLookup = async (req, res, next) => {
  const { login } = req.body

  // Fetch all users from redis
  const redisUsers = await Promise.all(login.map(async item => {
    const redisItem = await redis.get(item)
    if (redisItem) {
      // Remove from input array (login variable) when found in redis
      const index = login.indexOf(item)
      if (index > -1) { // Only splice array when item is found
        login.splice(index, 1) // 2nd parameter means remove one item only
      }

      return redisItem
    }
  }))

  // Wait Promise to be finished before doing any modifications
  Promise.all(redisUsers)
    .then(() => {
      // Remove results that were not found in redis (null values)
      let filteredArr = redisUsers.filter(el => el !== null && el !== undefined)
      // Parse stored data from redis
      filteredArr = filteredArr.map(el => JSON.parse(el))
      // Request body modifications so we don't call the API for users already found in redis
      // Reassign spliced login handles
      req.body.login = login
      // Create a new key-value pair for the redis-fetched data in the req.body so we can attach it in our main response later
      req.body.__fromRedisUsers = filteredArr
      next()
    })
}

const caching = {
  redisLookup
}

module.exports = caching
