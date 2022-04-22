const express = require('express')
const renderShelfHTML = require('@herbsjs/herbsshelf')
const { herbarium } = require('@herbsjs/herbarium')


const { rest } = require('./rest')

function herbsshelf(app, config) {
  const usecases = Array.from(herbarium.usecases.all).map(([_, item]) =>
            ({ usecase: item.usecase(), id: item.id, tags: { group: item.group } }))

  app.get('/herbsshelf', (_, res) => {
    res.setHeader('Content-Type', 'text/html')
    const shelf = renderShelfHTML('herbsjs-microservice-products', usecases)
    res.write(shelf)
    res.end()
  })
  // eslint-disable-next-line no-console
  console.info(`\n🌿 Herbs Shelf endpoint - /herbsshelf \n`)
}

async function start(config) {

  herbarium.requireAll()

  const app = express()
  await rest(app, config)
  
  await herbsshelf(app, config)

  return app.listen(
    { port: process.env.SERVER_PORT || config.api.port },
    // eslint-disable-next-line no-console
    () => console.log(`🚀 Server UP and 🌪️  - 
    http://localhost:${process.env.SERVER_PORT || config.api.port}${process.env.GLOBAL_PREFIX}`))
}

module.exports = { start }



