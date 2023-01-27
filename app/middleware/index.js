const authJwt = require('./authJwt')
const verifyRegister = require('./verifyRegister')
const validations = require('./validations')
const caching = require('./caching')
const allowHeaders = require('./allowHeaders')
const validator = require('./validator')
const errorHandler = require('./errorHandler')

module.exports = {
  authJwt,
  verifyRegister,
  validations,
  caching,
  allowHeaders, // Is a function
  validator, // Is a function
  errorHandler
}
