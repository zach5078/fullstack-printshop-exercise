import React from 'react'
import Upload from './Upload'

export default function products(props) {
  const { products } = props
  if(!products || !products.length) {
    return 'No product found'
  }

  return props.products.map(item => {
    const { description, userName, img, _id } = item || {}
    return (
      <React.Fragment key={_id}>
        <img src={img} alt="product cover" />
        <div>{description}</div>
        <h1>{`username: ${userName}`}</h1>
        <div>{`productid: ${_id}`}</div>
        <Upload productId={_id} />
      </React.Fragment>
    )
  })
}