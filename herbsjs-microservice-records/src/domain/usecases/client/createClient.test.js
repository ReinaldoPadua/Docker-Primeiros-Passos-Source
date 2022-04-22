const createClient = require('./createClient')
const assert = require('assert')


describe('Create client', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a client is valid', () => {
  
    it('should create client', async () => {
      // Given
      const injection = {
        clientRepository: new ( class ClientRepository {
          async insert(client) { return (client) }
        })
      }

      const req = {
        name: 'a text',
        email: 'a text'
      }

      // When
      const uc = createClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)

    })
  })

  describe('When a client is invalid', () => {

    it('should not create client', async () => {
      // Given
      const injection = {}

      const req = {
        name: true,
        email: true
      }

      // When
      const uc = createClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      // assert.ok(ret.isInvalidEntityError)

    })
  })
})
