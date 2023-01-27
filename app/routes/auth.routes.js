const { body } = require('express-validator')
const { verifyRegister, validator } = require('../middleware')
const controller = require('../controllers/auth.controller')

module.exports = (app) => {
  app.post('/api/auth/register', [
    body('email').trim().toLowerCase().isEmail().withMessage('Email field must be a valid email address'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password field must be at least 8 characters')
      .matches(/^\S*$/).withMessage('Password field must not contain spaces'),
    validator,
    verifyRegister.checkDuplicateEmail
  ],
  controller.register)

  app.post('/api/auth/login', controller.login)
}
