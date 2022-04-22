const findProductById = require('./findProduct')
const assert = require('assert')
const Product = require('../../entities/Product')

describe('Find a product', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a product exists', () => {

    it('should return a product', async () => {
      // Given 
      const fakeProduct = {
        id: 99,
        description: 'a text',
        value: 99
      }

      const injection = {
        ProductRepository: class ProductRepository {
          async findByID(id) { return ([Product.fromJSON(fakeProduct)]) }
        }
      }

      const req = {
        ids: 99
      }

      // When
      const uc = findProductById(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)
      assert.strictEqual(JSON.stringify(ret.ok), JSON.stringify({id: ret.ok.id,...fakeUser}))
    })
  })

  describe('When a product does not exists', () => {

    it('return not return a product', async () => {
      // Given
      const injection = {
        ProductRepository: class ProductRepository {
          async findByID(id) { return ([]) }
        }
      }

      const req = {
        ids: null
      }

      // When
      const uc = findProductById(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.ok(ret.isNotFoundError)
    })
  })
})
