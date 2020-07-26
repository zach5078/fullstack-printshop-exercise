const cuid = require('cuid')
const bcrypt = require('bcrypt')
const { isEmail, isAlphanumeric } = require('validator')

const { db } = require('../db')
const SALT_ROUNDS = 10

const User = db.model('User', {
  _id: { type: String, default: cuid() },
  username: usernameSchema(),
  password: { type: String, maxLength: 120, required: true },
  email: emailSchema({ required: true })
})

function usernameSchema() {
  return {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 16,
    validate: [
      {
        validator: isAlphanumeric,
        message: props => `${props.value} contains special characters`
      },
      {
        validator: str => !str.match(/^admin$/i),
        message: () => 'Invalid username'
      },
      {
        validator: function (username){
          return isUnique(this, username)
        },
        message: () => 'username is token'
      }
    ]
  }
}

function emailSchema(opts = {}) {
  const { required } = opts
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    }
  }
}

async function isUnique(doc, username) {
  const exsiting = await get(username)
  return !exsiting || doc._id === exsiting._id
}

async function hashPassword(user) {
  if(!user.password) {
    throw user.invalidate('password', 'password is required')
  }
  if(user.password.length < 8) {
    throw user.invalidate('password', 'password must be at least 8 characters')
  }
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
}

async function create(data) {
  const user = new User(data)
  await hashPassword(user)
  await user.save()
  return user
}

async function get(username) {
  return await User.findOne({username})
}

async function list(opts = {}) {
  const { limit, offset } = opts
  return await User.find()
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
}

async function edit(id, change) {
  const user = await get(id)
  Object.keys(change).forEach((key) => {
    user[key] = change[key]
  })
  if(change.password) {
    await hashPassword(user)
  }
  await user.save()
  return user
}

async function remove(username) {
  await User.deleteOne({username})
}

module.exports = {
  create,
  get,
  list,
  edit,
  remove
}