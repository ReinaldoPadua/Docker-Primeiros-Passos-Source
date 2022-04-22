const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Client =
        entity('Client', {
          id: id(Number),
          name: field(String),
          email: field(String)
        })
module.exports =
        herbarium.entities
          .add(Client, 'Client')
          .entity  