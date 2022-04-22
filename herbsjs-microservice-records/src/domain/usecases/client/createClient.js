const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Client = require('../../entities/client')
const ClientRepository = require('../../../infra/data/repositories/clientRepository')

const dependency = { ClientRepository }

const createClient = injection =>
  usecase('Create Client', {
    // Input/Request metadata and validation 
    request: {
      name: String,
      email: String
    },

    // Output/Response metadata
    response: Client,

    //Authorization with Audit
    // authorize: (user) => (user.canCreateClient ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    //Step description and function
    'Check if the Client is valid': step(ctx => {
      ctx.client = Client.fromJSON(ctx.req)
      ctx.client.id = Math.floor(Math.random() * 100000)
      
      if (!ctx.client.isValid()) 
        return Err.invalidEntity({
          message: 'The Client entity is invalid', 
          payload: { entity: 'Client' },
          cause: ctx.client.errors 
        })

      // returning Ok continues to the next step. Err stops the use case execution.
      return Ok() 
    }),

    'Save the Client': step(async ctx => {
      const repo = new ctx.di.ClientRepository(injection)
      const client = ctx.client
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.insert(client))
    })
  })

module.exports =
  herbarium.usecases
    .add(createClient, 'CreateClient')
    .metadata({ group: 'Client', operation: herbarium.crud.create, entity: Client })
    .usecase