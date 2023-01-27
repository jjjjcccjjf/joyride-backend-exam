const responseHelper = require('../helpers/response.helper')

const checkReqBody = async (req, res, next) => {
  const { login } = req.body
  if (!login || login.length <= 0) {
    res.status(400).json(responseHelper.responseTemplate([], 'Invalid request payload.'))
    return
  }

  next()
}

const checkMaxTenLogins = async (req, res, next) => {
  const { login } = req.body

  if (login.length > 10) {
    res.status(400).json(responseHelper.responseTemplate([], 'Provided users cannot exceed amount: 10.'))
    return
  }

  next()
}

const removeDuplicates = async (req, res, next) => {
  const { login } = req.body
  req.body.login = [...new Set(login)]

  next()
}

const validations = {
  checkMaxTenLogins,
  checkReqBody,
  removeDuplicates
}

module.exports = validations
