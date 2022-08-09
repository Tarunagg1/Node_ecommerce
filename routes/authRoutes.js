const express = require('express')
const flasherMiddleware = require('../middlewares/flashMiddleware')
const { addUser } = require('../modules/services/userService')
const router = express.Router()
const registerSchema = require('../modules/validations/auth.validation')
const { joiErrorFormatter, mongooseErrorFormatter } = require('../utils/validationFormator')

/**
 * Shows page for user registration
 */
router.get('/register', (req, res) => {
  return res.render('registration')
})

/**
* Handles user registration
*/
router.post('/register', async (req, res) => {
  try {
    const validationResult = registerSchema.validate(req.body, {
      abortEarly: false
    })
    if (validationResult.error) {
      req.session.flashData = {
        message: {
          type: 'error',
          body: 'Validation Errors'
        },
        errors: joiErrorFormatter(validationResult.error),
        formData: req.body
      }
      return res.redirect('/register')
    }
    await addUser(req.body)
    req.session.flashData = {
      message: {
        type: 'success',
        body: 'Registration success'
      }
    }
    return res.redirect('/register')
    // return res.status(200).render('registration', { message: 'register success' })
  } catch (e) {
    req.session.flashData = {
      message: {
        type: 'error',
        body: 'Validation Errors'
      },
      errors: mongooseErrorFormatter(e),
      formData: req.body
    }
    // console.log(e)
    return res.status(400).redirect('/register')
  }
})

/**
 * Shows page for user login
 */
router.get('/login', flasherMiddleware, (req, res) => {
  return res.render('login')
})

/**
 * Shows page for user login
 */
router.post('/login', flasherMiddleware, (req, res) => {
  return res.render('login')
})

module.exports = router
