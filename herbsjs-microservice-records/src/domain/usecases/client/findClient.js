const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Client = require('../../entities/client')
const ClientRepository = require('../../../infra/data/repositories/clientRepository')

const dependency = { ClientRepository }

const findClient = injection =>
  usecase('Find a Client', {
    // Input/Request metadata and validation 
    request: {
      ids: Number,
    },

    // Output/Response metadata
    response: Client,

    //Authorization with Audit
    // authorize: (user) => (user.canFindOneClient ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the Client': step(async ctx => {
      const ids = ctx.req.ids
      const repo = new ctx.di.ClientRepository(injection)
      const [client] = await repo.findByID(ids)
      if (!client) return Err.notFound({ 
        message: `Client entity not found by ID: ${ids}`,
        payload: { entity: 'Client', ids }
      })
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = client)
    })
  })

module.exports =
  herbarium.usecases
    .add(findClient, 'FindClient')
    .metadata({ group: 'Client', operation: herbarium.crud.read, entity: Client })
    .usecase