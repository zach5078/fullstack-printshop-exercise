const jwt = require('jsonwebtoken')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const { promisify } = require('util')
const bcrypt = require('bcrypt')

const autoCatch = require('./lib/auto-catch')
const Users = require('./models/users')
const { adminPassword, jwtSecret } = require('./config')

const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }

jwt.signP = promisify(jwt.sign)

passport.use(adminStrategy())
const authenticate = passport.authenticate('local', { session: false })

async function login (req, res, next) {
  let token = sign({ username: req.user.username }) //!这里竟然不能用await异步的写法，否则导致报错：[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

  res.cookie('jwt', token, { httpOnly: true })
  res.json({ success: true, token: token })
}

async function ensureUser (req, res, next) {
  const jwtString = req.headers.authorization || req.cookies.jwt
  const payload = await verify(jwtString)

  if (payload.username) {
    req.user = payload
    if(req.user.username === 'admin') req.isAdmin = true
    return next()
  }

  const err = new Error('Unauthorized')
  err.statusCode = 401
  next(err)
}

function sign (payload) {
  const token = jwt.sign(payload, jwtSecret, jwtOpts)
  return token
}

async function verify (jwtString = '') {
  jwtString = jwtString.replace(/^Bearer /i, '')

  try {
    const payload = await jwt.verify(jwtString, jwtSecret)
    return payload
  } catch (err) {
    err.statusCode = 401
    throw err
  }
}

function adminStrategy() {
  return new Strategy(async function(username, password, cb) {
    const isAdmin = (username === 'admin') && (password === adminPassword) 
    if(isAdmin) return cb(null, { username: 'admin' })

    try {
      const user = await Users.get(username)
      if(!user) return cb(null, false)

      const isUser = await bcrypt.compare(password, user.password)
      if(!isUser) return cb(null, false)

      cb(null, { username: user.username })
    }catch(err) {
      cb(null, false)
    }
  })
}

module.exports = {
  authenticate,
  login: autoCatch(login),
  ensureUser: autoCatch(ensureUser)
}