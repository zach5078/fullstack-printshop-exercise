const passport = require('passport')
const Strategy = require('passport-local').Strategy
const expressSession = require('express-session')
const { adminPassword, sessionSecret } = require('./config')

passport.use(adminStrategy())

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, user))
const authenticate = passport.authenticate('local')

function setMiddleware(app) {
  app.use(expressSession({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
  }))
  
  app.use(passport.initialize())
  app.use(passport.session())  
}

function login(req, res) {
  res.json({ success: true })
}

function ensureAdmin(req, res, next) {
  const isAdmin = req.user && req.user.username === 'admin'
  if (isAdmin) return next()
  
  const err = new Error('Unauthorized')
  err.statusCode = 401
  next(err)
}

function adminStrategy() {
  return new Strategy(function(username, password, cb) {
    const isAdmin = (username === 'admin') && (password === adminPassword) 
    if(isAdmin) {
      cb(null, { username: 'admin' })
    }
    cb(null, false)
  })
}

module.exports = {
  setMiddleware,
  authenticate,
  login,
  ensureAdmin
}