require('dotenv').config()

module.exports = {
  adminPassword: process.env.ADMIN_PASSWORD || 'iamzach',
  jwtSecret: process.env.JWT_SECRET || 'mark it zero',
  sessionSecret: process.env.SESSION_SECRET || 'mark it zero',
  mongo: {
    connectionString: process.env.MONGO_URI || 'mongodb://localhost:27017/printshop'
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY
  }
}