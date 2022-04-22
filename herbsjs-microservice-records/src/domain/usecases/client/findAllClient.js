const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Client = require('../../entities/client')
const ClientRepository = require('../../../infra/data/repositories/clientRepository')

const dependency = { ClientRepository }

const findAllClient = injection =>
  usecase('Find all Clients', {
    // Input/Request metadata and validation
    request: {
      limit: Number,
      offset: Number
    },

    // Output/Response metadata
    response: [Client],

    //Authorization with Audit
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return all the Clients': step(async ctx => {
      const repo = new ctx.di.ClientRepository(injection)
      const clients = await repo.findAll(ctx.req)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = clients)
    })
  })

module.exports =
  herbarium.usecases
    .add(findAllClient, 'FindAllClient')
    .metadata({ group: 'Client', operation: herbarium.crud.readAll, entity: Client })
    .usecase
