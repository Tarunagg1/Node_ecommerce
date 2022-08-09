require('dotenv').config()
const express = require('express')
require('./config/db')
const authRoutes = require('./routes/authRoutes')
const session = require('express-session')
const logger = require('morgan')
const flasherMiddleware = require('./middlewares/flashMiddleware')

const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const PORT = 4000
app.use(session({
  secret: '688fa678b868990ae84f30f641ff18b8cc524572',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(logger('dev'))
app.locals.message = {}
app.locals.formData = {}
app.locals.errors = {}

app.use('/', authRoutes)

app.get('/', flasherMiddleware, (req, res) => {
  return res.render('index')
})

app.use((req, res, next) => {
  res.status(404).render('404')
})

// app.get('/register', (req, res) => {
//   // return res.status(200).json({ message: 'Server running' });
//   return res.render('registration', { message: '' })
// })

app.listen(PORT, () => {
  console.log('server listening on port ' + PORT)
})

module.exports = app
