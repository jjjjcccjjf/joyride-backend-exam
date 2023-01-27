const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const responseHelper = require('../helpers/response.helper')

const checkDuplicateEmail = async (req, res, next) => {
  const { email } = req.body
  prisma.users.findFirst({
    where: {
      email
    }
  }).then(user => {
    if (user) {
      return res.status(400).json(responseHelper.responseTemplate({}, 'Email is already in use.'))
    }

    next()
  })
}

const verifyRegister = {
  checkDuplicateEmail
}

module.exports = verifyRegister
