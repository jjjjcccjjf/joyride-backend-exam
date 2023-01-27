const { authJwt, validations, caching } = require('../middleware')
const controller = require('../controllers/user.controller')

module.exports = function (app) {
  app.post(
    '/api/list',
    [authJwt.verifyToken, validations.checkReqBody, validations.checkMaxTenLogins, validations.removeDuplicates, caching.redisLookup],
    controller.list
  )
}
