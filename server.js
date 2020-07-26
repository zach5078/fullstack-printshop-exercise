const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const api = require('./api')
const middleware = require('./middleware')
const auth = require('./auth-with-jwt')

const port = process.env.PORT || 1337
const app = express()

app.disable('x-powered-by')

app.use(middleware.logger)
app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser())
// auth.setMiddleware(app) //only needed if we use auth-with-sessions

app.post('/login', auth.authenticate, auth.login)
app.post('/users', api.createUser)
app.put('/users/:id', auth.ensureUser, api.editUser)
app.get('/users', auth.ensureUser, api.listUsers)
app.get('/products', api.listProducts)
app.post('/products', auth.ensureUser, api.createProduct)
app.get('/products/:id', api.getProduct)
app.put('/products/:id', auth.ensureUser, api.editProduct)
app.delete('/products/:id', auth.ensureUser, api.deleteProduct)
app.get('/orders', auth.ensureUser, api.listOrders)
app.post('/orders', auth.ensureUser, api.createOrder)
app.get('/orders/:id', auth.ensureUser, api.getOrder)
app.post('/products/:id/image', api.uploadImage)
app.get('/home', api.showHomepage)
app.get('/health', api.checkHealth)

app.use(middleware.handleError)
app.use(middleware.notFound)

app.listen(port, () => console.log(`Server is running at port: ${port}`))