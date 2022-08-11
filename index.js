require('dotenv').config()
const express = require('express')
const mongoDbConnection = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const session = require('express-session')
const logger = require('morgan')
const flasherMiddleware = require('./middlewares/flashMiddleware')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const authMiddleware = require('./middlewares/authMiddleware')
require('./utils/authStrategy')

const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const PORT = 4000

app.use(session({
  secret: '688fa678b868990ae84f30f641ff18b8cc524572',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({ mongoUrl: process.env.MONGO })
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(logger('dev'))

app.locals.message = {}
app.locals.formData = {}
app.locals.errors = {}

app.use('/', authRoutes)

app.get('/', flasherMiddleware, authMiddleware, (req, res) => {
  console.log(req.user)
  return res.render('index')
})

app.get('/homepage', authMiddleware, (req, res) => {
  return res.send(`welcome ${req.user.name}`)
})

app.use((req, res, next) => {
  res.status(404).render('404')
})

app.listen(PORT, () => {
  console.log('server listening on port ' + PORT)
})

module.exports = app
