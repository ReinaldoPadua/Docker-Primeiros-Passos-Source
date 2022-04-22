const findAllClient = require('./findAllClient')
const assert = require('assert')

describe('Find all clients', () => {
    const authorizedUser = { hasAccess: true }

    it('should return all clients', async () => {
      // Given
      const req = { limit:0, offset:0}
      const injection = {
        clientRepository: new ( class ClientRepository {
          async  findAll() { return [] }
        })
      }

      // When
      const uc = findAllClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)
    })
})
