const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Client = require('../../entities/client')
const ClientRepository = require('../../../infra/data/repositories/clientRepository')

const dependency = { ClientRepository }

const deleteClient = injection =>
  usecase('Delete the Client', {
    // Input/Request metadata and validation 
    request: {
      id: Number
    },

    // Output/Response metadata
    response: Boolean,

    //Authorization with Audit
    // authorize: (user) => (user.canDeleteClient ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the Client exist': step(async ctx => {
      const repo = new ctx.di.ClientRepository(injection)
      const [client] = await repo.findByID(ctx.req.id)
      ctx.client = client

      if (client) return Ok()
      return Err.notFound({
          message: `Client ID ${ctx.req.id} does not exist`,
          payload: { entity: 'Client' }
      })
    }),

    'Delete the Client': step(async ctx => {
      const repo = new ctx.di.ClientRepository(injection)
      ctx.ret = await repo.delete(ctx.client)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret)
    })
  })

module.exports =
  herbarium.usecases
    .add(deleteClient, 'DeleteClient')
    .metadata({ group: 'Client', operation: herbarium.crud.delete, entity: Client })
    .usecase