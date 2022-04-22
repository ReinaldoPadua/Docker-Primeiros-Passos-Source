const findClientById = require('./findClient')
const assert = require('assert')
const Client = require('../../entities/Client')

describe('Find a client', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a client exists', () => {

    it('should return a client', async () => {
      // Given 
      const fakeClient = {
        id: 99,
        name: 'a text',
        email: 'a text'
      }

      const injection = {
        ClientRepository: class ClientRepository {
          async findByID(id) { return ([Client.fromJSON(fakeClient)]) }
        }
      }

      const req = {
        ids: 99
      }

      // When
      const uc = findClientById(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)
      assert.strictEqual(JSON.stringify(ret.ok), JSON.stringify({id: ret.ok.id,...fakeUser}))
    })
  })

  describe('When a client does not exists', () => {

    it('return not return a client', async () => {
      // Given
      const injection = {
        ClientRepository: class ClientRepository {
          async findByID(id) { return ([]) }
        }
      }

      const req = {
        ids: null
      }

      // When
      const uc = findClientById(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.ok(ret.isNotFoundError)
    })
  })
})
