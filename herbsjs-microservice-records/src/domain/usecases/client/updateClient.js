const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Client = require('../../entities/client')
const ClientRepository = require('../../../infra/data/repositories/clientRepository')

const dependency = { ClientRepository }

const updateClient = injection =>
  usecase('Update Client', {
    // Input/Request metadata and validation 
    request: {
      id: Number,
      name: String,
      email: String
    },

    // Output/Response metadata
    response: Client,

    //Authorization with Audit
    // authorize: (user) => (user.canUpdateClient ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the Client': step(async ctx => {
      const repo = new ctx.di.ClientRepository(injection)
      const [client] = await repo.findByID(ctx.req.id)
      ctx.client = client
      if (client === undefined) return Err.notFound({
        message: `Client not found - ID: ${ctx.req.id}`,
        payload: { entity: 'Client' }
      })

      return Ok(client)
    }),

    'Check if it is a valid Client before update': step(ctx => {
      const oldClient = ctx.client
      const newClient = Client.fromJSON(merge.all([ oldClient, ctx.req ]))
      ctx.client = newClient

      return newClient.isValid() ? Ok() : Err.invalidEntity({
        message: `Client is invalid`,
        payload: { entity: 'Client' },
        cause: newClient.errors
      })

    }),

    'Update the Client': step(async ctx => {
      const repo = new ctx.di.ClientRepository(injection)
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.update(ctx.client))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateClient, 'UpdateClient')
    .metadata({ group: 'Client', operation: herbarium.crud.update, entity: Client })
    .usecase