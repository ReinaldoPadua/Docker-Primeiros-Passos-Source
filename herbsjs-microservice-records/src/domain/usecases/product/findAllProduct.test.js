const findAllProduct = require('./findAllProduct')
const assert = require('assert')

describe('Find all products', () => {
    const authorizedUser = { hasAccess: true }

    it('should return all products', async () => {
      // Given
      const req = { limit:0, offset:0}
      const injection = {
        productRepository: new ( class ProductRepository {
          async  findAll() { return [] }
        })
      }

      // When
      const uc = findAllProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)
    })
})
