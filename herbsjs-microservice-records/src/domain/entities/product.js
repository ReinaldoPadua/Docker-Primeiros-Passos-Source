const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Product =
        entity('Product', {
          id: id(Number),
          description: field(String),
          price: field(Number)
        })

module.exports =
  herbarium.entities
    .add(Product, 'Product')
    .entity
