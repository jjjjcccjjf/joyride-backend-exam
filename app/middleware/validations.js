const responseHelper = require('../helpers/responseHelper')

const checkReqBody = async (req, res, next) => {
  const { login } = req.body
  if (!login || login.length <= 0) {
    res.status(400).json(responseHelper.responseTemplate([], 'Invalid request payload. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam'))
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

const validations = {
  checkMaxTenLogins,
  checkReqBody
}

module.exports = validations
