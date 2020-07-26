const pinoNoir = require('pino-noir')
const pinoLogger = require('express-pino-logger')

const { STATUS_CODES } = require('http')

function cors (req, res, next) {
  const origin = req.headers.origin

  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, XMODIFY'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin'
  )

  next()
}

function handleError (err, req, res, next) {
  console.log('handleError', err)
  if (res.headersSent) return next(err)

  if(err.name === 'ValidationError') {
    return res.json({error: err.message})
  }

  const statusCode = err.statusCode || 500
  const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'
  res.status(statusCode).json({ error: errorMessage })
}

function notFound(req, res) {
  res.status(404).json({error: 'Not Found'})
}

function logger () {
  return pinoLogger({
    serializers: pinoNoir([
      'res.headers.set-cookie',
      'req.headers.cookie',
      'req.headers.authorization'
    ])
  })
}
 
module.exports = {
  logger: logger(),
  cors,
  handleError,
  notFound
}