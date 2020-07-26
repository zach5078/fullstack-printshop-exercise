const cuid = require('cuid')
const { isEmail } = require('validator')

const { db } = require('../db')

function emailSchema(opts = {}) {
  const { required } = opts
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid Email address`
    }
  }
}

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: emailSchema({ required: true }),
  products: [
    {
      type: String,
      ref: 'Product',
      index: true,
      required: true
    }
  ],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  },
})

async function create(data) {
  const order = await new Order(data).save()
  return order
}

async function get(id) {
  const order = await Order.findById(id)
    .populate('products')
    .exec()
  return order
}

async function list(opts = {}) {
  const { limit = 5, offset = 0, productId, status, username } = opts
  const query = {
    username
  }
  if(productId) {
    query.products = productId
  }
  if(status) {
    query.status = status
  }

  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
    .populate('products')
    .exec()

  return orders
}

module.exports = {
  create,
  get,
  list
}