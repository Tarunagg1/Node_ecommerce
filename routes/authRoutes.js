const express = require('express')
const flasherMiddleware = require('../middlewares/flashMiddleware')
const { addUser } = require('../modules/services/userService')
const router = express.Router()
const registerSchema = require('../modules/validations/auth.validation')
const { joiErrorFormatter, mongooseErrorFormatter } = require('../utils/validationFormator')
const passport = require('passport')
const guestMiddleware = require('../middlewares/guestMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * Shows page for user registration
 */
router.get('/register', guestMiddleware, flasherMiddleware, (req, res) => {
  return res.render('registration')
})

/**
* Handles user registration
*/
router.post('/register', guestMiddleware, async (req, res) => {
  console.log('hete')
  try {
    // const validationResult = registerSchema.validate(req.body, {
    //   abortEarly: false
    // })
    // console.log(validationResult.error)
    // if (validationResult.error) {
    //   req.session.flashData = {
    //     message: {
    //       type: 'error',
    //       body: 'Validation Errors'
    //     },
    //     errors: joiErrorFormatter(validationResult.error),
    //     formData: req.body
    //   }
    //   return res.redirect('/register')
    // }
    await addUser(req.body)
    req.session.flashData = {
      message: {
        type: 'success',
        body: 'Registration success'
      }
    }
    return res.redirect('/register')
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
router.get('/login', guestMiddleware, flasherMiddleware, (req, res) => {
  return res.render('login')
})

/**
 * Shows page for user login
 */
router.post('/login', guestMiddleware, flasherMiddleware, (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    req.session.flashData = {
      message: {
        type: 'error',
        body: 'Missing credentials'
      }
    }
    return res.redirect('/login')
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      req.session.flashData = {
        message: {
          type: 'error',
          body: 'Login failed'
        }
      }
      return res.redirect('/login')
    }

    if (!user) {
      req.session.flashData = {
        message: {
          type: 'error',
          body: info.error
        }
      }
      return res.redirect('/login')
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Err:', err)
        req.session.flashData = {
          message: {
            type: 'error',
            body: 'Login failed'
          }
        }
      }
      return res.redirect('/homepage')
    })
  })(req, res, next)
})

/**
 * Logs out a user
 */
router.get('/logout', authMiddleware, (req, res) => {
  req.logout(() => {
    req.session.flashData = {
      message: {
        type: 'success',
        body: 'Logout success'
      }
    }
    return res.redirect('/')
  })
})

module.exports = router
