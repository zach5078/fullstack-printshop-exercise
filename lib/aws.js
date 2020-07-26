const AWS = require('aws-sdk')
const { promisify } = require('util')
const { aws } = require('../config')

AWS.config.update({
  region: 'ap-southeast-1',
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey
});

const s3 = new AWS.S3()
s3.uploadP = promisify(s3.upload)

async function upload(req, filename = '') {
  const ext = {
    'image/png': 'png',
    'image/jpeg': 'jpg'
  }[req.headers['content-type']]

  if (!ext) throw new Error('Invalid Image Type')
  const params = {
    Bucket: 'fullstack-develpment-printshop',
    Key: `${filename}.${ext}`,
    Body: req,
    ACL: 'public-read'
  }

  return await s3.uploadP(params)
}

module.exports = {
  upload
}