const deleteClient = require('./deleteClient')
const assert = require('assert')
const Client = require('../../entities/Client')

describe('Delete the client', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a client exists', () => {

    it('should delete client', async () => {
      const injection = {
        ClientRepository: class ClientRepository {
          async delete(entity) { return true }
          async findByID(id) { return [Client.fromJSON({ id })] }
        }
      }
      
      const req = {
        id: 99
      }

      // When
      const uc = deleteClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      

    })
  })
  
  describe('When a client does not exists', () => {

    it('should not delete client', async () => {
      // Given
      const injection = {
        ClientRepository: class ClientRepository {
          async findByID(id) { return [] }
        }
      }
      const req = { id : '5' }

      // When
      const uc = deleteClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.deepStrictEqual(ret.err, {request :[{id:[{wrongType:"Number"}]}]})
    })
  })
})
