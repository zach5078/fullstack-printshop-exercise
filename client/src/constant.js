export const env = process.env.NODE_ENV
export const requestUrl = env === 'development' ?
  'http://localhost:1337/api' :
  'https://fullstack-printshop.herokuapp.com/api'