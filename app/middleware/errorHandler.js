const responseHelper = require('../helpers/response.helper')

module.exports = (err, req, res, next) => {
  return res.status(400).json(responseHelper.responseTemplate({}, err.type === 'entity.parse.failed' ? 'Illegal JSON format for request payload' : err.type))
}
