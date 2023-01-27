const Redis = require('ioredis')
const redis = new Redis({
  host: 'redis-13854.c84.us-east-1-2.ec2.cloud.redislabs.com',
  port: 13854,
  password: process.env.REDIS_PASSWORD
})
// @Refactor ^^

const redisLookup = async (req, res, next) => {
  const { login } = req.body

  const redisUsers = await Promise.all(login.map(async item => {
    const redisItem = await redis.get(item)
    if (redisItem) {
      // remove from login

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
