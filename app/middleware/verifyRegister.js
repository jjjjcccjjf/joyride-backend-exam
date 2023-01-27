const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const responseHelper = require('../helpers/response.helper')

const checkRequestBody = async (req, res, next) => {
  const { email, password } = req.body
  console.log(email, password)
  if (!email || !password) {
    res.status(400).json(responseHelper.responseTemplate({}, 'Email and password is required. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam'))
    return
  }
  next()
}

const checkDuplicateEmail = async (req, res, next) => {
  const { email } = req.body
  prisma.users.findFirst({
    where: {
      email
    }
  }).then(user => {
    if (user) {
      res.status(400).json(responseHelper.responseTemplate({}, 'Email is already in use'))
      return
    }

    next()
  })
}

const verifyRegister = {
  checkRequestBody,
  checkDuplicateEmail
}

module.exports = verifyRegister
