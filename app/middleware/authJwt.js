const jwt = require('jsonwebtoken')
const responseHelper = require('../helpers/response.helper')

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    return res.status(401).json(responseHelper.responseTemplate({}, 'Missing authentication token.'))
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send(responseHelper.responseTemplate({}, 'Illegal access token provided.'))
    }
    req.userId = decoded.id
    next()
  })
}

const authJwt = {
  verifyToken
}

module.exports = authJwt
