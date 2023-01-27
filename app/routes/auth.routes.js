const { verifyRegister } = require('../middleware')
const controller = require('../controllers/auth.controller')

module.exports = function (app) {
  app.post('/api/auth/register', [verifyRegister.checkRequestBody, verifyRegister.checkDuplicateEmail], controller.register)

  app.post('/api/auth/login', controller.login)
}
