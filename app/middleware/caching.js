const redis = require('../config/redis.config')

const redisLookup = async (req, res, next) => {
  const { login } = req.body

  // Fetch all users from redis
  const redisUsers = await Promise.all(login.map(async item => {
    const redisItem = await redis.get(item)
    if (redisItem) {
      // Remove from array when found in redis
      const index = login.indexOf(item)
      if (index > -1) { // only splice array when item is found
        login.splice(index, 1) // 2nd parameter means remove one item only
      }

      return redisItem
    }
  }))

  Promise.all(redisUsers)
    .then(() => {
      let filteredArr = redisUsers.filter(el => el !== null && el !== undefined)
      filteredArr = filteredArr.map(el => JSON.parse(el))

      req.body.login = login
      req.body.__fromRedisUsers = filteredArr
      next()
    })
}

const caching = {
  redisLookup
}

module.exports = caching
