const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const responseHelper = require('../helpers/response.helper')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
  const { email, password } = req.body

  const result = await prisma.users.create({
    data: {
      email,
      password: bcrypt.hashSync(password, 8)
    }
  }).catch(err => {
    return res.status(500).json(responseHelper.responseTemplate({}, err.message))
  })

  // Remove the password field in the response
  delete result.password

  res.json(responseHelper.responseTemplate(result, ''))
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  await prisma.users.findFirst({
    where: {
      email
    }
  }).then(user => {
    if (!user) {
      return res.status(400).json(responseHelper.responseTemplate({}, 'User not found.'))
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    )

    if (!passwordIsValid) {
      return res.status(400).json(responseHelper.responseTemplate({}, 'Invalid credentials.'))
    }

    const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
      expiresIn: 86400 // 24 hours
    })

    // Remove the password field in the response
    delete user.password
    user.accessToken = token

    res.json(responseHelper.responseTemplate(user, ''))
  }).catch(err => {
    res.status(500).json(responseHelper.responseTemplate({}, err.message))
  })
}
