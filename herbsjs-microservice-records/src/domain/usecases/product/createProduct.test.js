const createProduct = require('./createProduct')
const assert = require('assert')


describe('Create product', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a product is valid', () => {
  
    it('should create product', async () => {
      // Given
      const injection = {
        productRepository: new ( class ProductRepository {
          async insert(product) { return (product) }
        })
      }

      const req = {
        description: 'a text',
        value: 99
      }

      // When
      const uc = createProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)

    })
  })

  describe('When a product is invalid', () => {

    it('should not create product', async () => {
      // Given
      const injection = {}

      const req = {
        description: true,
        value: true
      }

      // When
      const uc = createProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      // assert.ok(ret.isInvalidEntityError)

    })
  })
})
