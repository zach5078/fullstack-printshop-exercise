const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')

const api = require('./api')
const middleware = require('./middleware')
const auth = require('./auth-with-jwt')
const ssr = require('./ssr')

const port = process.env.PORT || 1337
const app = express()

app.disable('x-powered-by')

app.use(middleware.logger)
app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser())

// auth.setMiddleware(app) //only needed if we use auth-with-sessions

app.get('/', ssr.renderHtml)
app.post('/api/login', auth.authenticate, auth.login)
app.post('/api/users', api.createUser)
app.put('/api/users/:id', auth.ensureUser, api.editUser)
app.get('/api/users', auth.ensureUser, api.listUsers)
app.get('/api/products', api.listProducts)
app.post('/api/products', auth.ensureUser, api.createProduct)
app.get('/api/products/:id', api.getProduct)
app.put('/api/products/:id', auth.ensureUser, api.editProduct)
app.delete('/api/products/:id', auth.ensureUser, api.deleteProduct)
app.get('/api/orders', auth.ensureUser, api.listOrders)
app.post('/api/orders', auth.ensureUser, api.createOrder)
app.get('/api/orders/:id', auth.ensureUser, api.getOrder)
app.post('/api/products/:id/image', api.uploadImage)
app.get('/api/health', api.checkHealth)

app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(middleware.handleError)
app.use(middleware.notFound)

app.listen(port, () => console.log(`Server is running at port: ${port}`))