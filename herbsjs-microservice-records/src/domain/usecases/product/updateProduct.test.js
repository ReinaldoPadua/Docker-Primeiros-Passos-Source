const updateProduct = require('./updateProduct')
const assert = require('assert')
const Product = require('../../entities/Product')

describe('Update product', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a product is invalid', () => {

    it('should update product', async () => {
      // Given 
      const fakeProduct = {
        id: 99,
        description: 'a text',
        value: 99
      }

      const injection = {
        ProductRepository: class ProductRepository {
          async findByID(id) { return ([Product.fromJSON(fakeProduct)]) }
          async update(id) { return true }
        }
      }


      const req = {
        id: 99,
        description: 'a text',
        value: 99
      }

      // When
      const uc = updateProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      

    })
  })

  describe('When a product is invalid', () => {

    it('should not update Product', async () => {
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
        id: true,
        description: true,
        value: true
      }

      // When
      const uc = updateProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      // assert.ok(ret.isInvalidEntityError)
    })
  })

  describe('When a product does not exist', () => {

    it('should return a error', async () => {
      // Given
      const retInjection = null
      const injection = {
        productRepository: new ( class ProductRepository {
          async findByID(id) { return (retInjection) }
          async update(id) { return true }
        })
      }

      const req = { id: 0, nickname: 'herbsUser', password: 'V&eryStr0ngP@$$' }

      // When
      const uc = updateProduct(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.ok(ret.isNotFoundError)
    })
  })
})
