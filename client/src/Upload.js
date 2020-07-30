import React from 'react'
import { requestUrl } from './constant'

export default function upload(props) {
  const handleUpload = (e) => {
    const { productId } = props
    const file = e.target.files[0]
    const url = `${requestUrl}/products/${productId}/image`
    fetch(url, {
      method: 'POST',
      body: file
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <React.Fragment>
      <span>Change Cover </span>
      <input type="file" id="input" onChange={(e) => handleUpload(e)} />
    </React.Fragment>
  )
}