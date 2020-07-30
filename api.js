const fs = require('fs')
const Products = require('./models/products')
const Orders = require('./models/orders')
const Users = require('./models/users')
const autoCatch = require('./lib/auto-catch')
const { upload } = require('./lib/aws')
const { checkHealth: dbCheckHealth } = require('./db')


async function listProducts(req, res) {
  const { limit = 5, offset = 0, tag = '' } = req.query
  res.json(await Products.list({
    limit: Number(limit), 
    offset: Number(offset),
    tag
  }))
}

async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if(!product) return next()

  res.json(product)
}

async function createProduct(req, res, next) {
  const product = await Products.create(req.body)
  res.json(product)
}

async function editProduct(req, res, next) {
  const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}

async function deleteProduct(req, res, next) {
  if(!req.isAdmin) return forbidden(next)
  
  await Products.remove(req.params.id)
  res.json({success: true})
}

async function createOrder (req, res) {
  const fields = req.body
  if(!req.isAdmin) fields.username = req.user.username

  const order = await Orders.create(fields)
  res.json(order)
}

async function listOrders (req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const fields = {
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status
  }
  if(!req.isAdmin) fields.username = req.user.username

  const orders = await Orders.list(fields)
  res.json(orders)
}

async function getOrder(req, res, next) {
  const { id } = req.params
  const order = await Orders.get(id)
  if(!order) return next()

  res.json(order)
}

async function uploadImage(req, res, next) {
  const productId = req.params.id
  const object = await upload(req, `product-images/${productId}`)
  const change = { img: object.Location }
  const product = await Products.edit(productId, change)

  res.json(product)
}

async function createUser(req, res, next) {
  const user = await Users.create(req.body)
  const { username, email } = user || {}

  req.log.info({ username, email }, 'user created')
  res.json({
    username,
    email
  })
}

async function deleteUser(req, res) {
  await Users.remove(req.params.id)
  res.json({success: true})
}

async function listUsers(req, res) {
  const { offset, limit } = req.query
  const users = await Users.list({
    offset: Number(offset),
    limit: Number(limit)
  })
  res.json(users)
}

async function editUser(req, res) {
  const user = await Users.edit(req.params.id, req.body)
  res.json(user)
}

function forbidden(next) {
  const error = new Error('Forbidden')
  error.statusCode = 403
  return next(error)
}

async function checkHealth (req, res, next) {
  await dbCheckHealth()
  res.json({ status: 'OK' })
}

async function handlePreflight(req, res) {
  res.status(200).json({success: true})
}

module.exports = autoCatch({
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  getOrder,
  uploadImage,
  createUser,
  deleteUser,
  listUsers,
  editUser,
  checkHealth,
  handlePreflight
})
