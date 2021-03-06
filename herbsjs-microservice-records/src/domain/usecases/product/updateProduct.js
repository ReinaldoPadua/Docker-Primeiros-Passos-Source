const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Product = require('../../entities/product')
const ProductRepository = require('../../../infra/data/repositories/productRepository')

const dependency = { ProductRepository }

const updateProduct = injection =>
  usecase('Update Product', {
    // Input/Request metadata and validation 
    request: {
      id: Number,
      description: String,
      value: Number
    },

    // Output/Response metadata
    response: Product,

    //Authorization with Audit
    // authorize: (user) => (user.canUpdateProduct ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the Product': step(async ctx => {
      const repo = new ctx.di.ProductRepository(injection)
      const [product] = await repo.findByID(ctx.req.id)
      ctx.product = product
      if (product === undefined) return Err.notFound({
        message: `Product not found - ID: ${ctx.req.id}`,
        payload: { entity: 'Product' }
      })

      return Ok(product)
    }),

    'Check if it is a valid Product before update': step(ctx => {
      const oldProduct = ctx.product
      const newProduct = Product.fromJSON(merge.all([ oldProduct, ctx.req ]))
      ctx.product = newProduct

      return newProduct.isValid() ? Ok() : Err.invalidEntity({
        message: `Product is invalid`,
        payload: { entity: 'Product' },
        cause: newProduct.errors
      })

    }),

    'Update the Product': step(async ctx => {
      const repo = new ctx.di.ProductRepository(injection)
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.update(ctx.product))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateProduct, 'UpdateProduct')
    .metadata({ group: 'Product', operation: herbarium.crud.update, entity: Product })
    .usecase