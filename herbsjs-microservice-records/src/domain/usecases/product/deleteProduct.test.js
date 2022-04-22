const deleteProduct = require('./deleteProduct')
const assert = require('assert')
const Product = require('../../entities/Product')

describe('Delete the product', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a product exists', () => {

    it('should delete product', async () => {
      const injection = {
        ProductRepository: class ProductRepository {
          async delete(entity) { return true }
          async findByID(id) { return [Product.fromJSON({ id })] }
        }
      }
      
      const req = {
        id: 99
      }

      // When
      const uc = deleteProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      

    })
  })
  
  describe('When a product does not exists', () => {

    it('should not delete product', async () => {
      // Given
      const injection = {
        ProductRepository: class ProductRepository {
          async findByID(id) { return [] }
        }
      }
      const req = { id : '5' }

      // When
      const uc = deleteProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.deepStrictEqual(ret.err, {request :[{id:[{wrongType:"Number"}]}]})
    })
  })
})
