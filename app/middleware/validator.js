const { validationResult } = require('express-validator')
const responseHelper = require('../helpers/response.helper')

module.exports = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().reduce((acc, curr) => curr.msg + '. ' + acc, '').trim()
    return res.status(422).json(responseHelper.responseTemplate({}, errorMessage))
  }
  next()
}
