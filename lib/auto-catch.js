function autoCatch(data) {
  if(typeof data === 'function') {
    return async function(...options) {
      try {
        await data(...options)
      } catch(err) {
        options[2](err)
      }
    }
  } else if(typeof data === 'object') {
    const result = {}
    Object.keys(data).forEach((f) => {
      result[f] = async function(...options) {
        try {
          await data[f](...options)
        } catch(err) {
          options[2](err)
        }
      }
    })
    return result
  }
}

module.exports = autoCatch