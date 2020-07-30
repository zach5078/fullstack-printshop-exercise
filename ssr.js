import fs from 'fs'
import path from 'path'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import App from './client/src/App'
import Products from './models/products'

export async function renderHtml(req, res, next) {
  const filename = path.resolve('./client/build/index.html')
  fs.readFile(filename, 'utf-8', async (err, data) => {
    if(err) {
      return next(err)
    }

    const products = await Products.list()
    const content = ReactDOMServer.renderToString(<App products={products} />)

    console.log(products)
    return res.send(
      data.replace(
        `<div id="root"></div>`,
        `<div id="root">${content}</div>
         <script id="initial-data" type="text/plain">${JSON.stringify({products})}</script>`
      )
    )
  })
}