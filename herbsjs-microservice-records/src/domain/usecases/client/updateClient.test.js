const updateClient = require('./updateClient')
const assert = require('assert')
const Client = require('../../entities/Client')

describe('Update client', () => {
  const authorizedUser = { hasAccess: true }

  describe('When a client is invalid', () => {

    it('should update client', async () => {
      // Given 
      const fakeClient = {
        id: 99,
        name: 'a text',
        email: 'a text'
      }

      const injection = {
        ClientRepository: class ClientRepository {
          async findByID(id) { return ([Client.fromJSON(fakeClient)]) }
          async update(id) { return true }
        }
      }


      const req = {
        id: 99,
        name: 'a text',
        email: 'a text'
      }

      // When
      const uc = updateClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      

    })
  })

  describe('When a client is invalid', () => {

    it('should not update Client', async () => {
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
        id: true,
        name: true,
        email: true
      }

      // When
      const uc = updateClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      // assert.ok(ret.isInvalidEntityError)
    })
  })

  describe('When a client does not exist', () => {

    it('should return a error', async () => {
      // Given
      const retInjection = null
      const injection = {
        clientRepository: new ( class ClientRepository {
          async findByID(id) { return (retInjection) }
          async update(id) { return true }
        })
      }

      const req = { id: 0, nickname: 'herbsUser', password: 'V&eryStr0ngP@$$' }

      // When
      const uc = updateClient(injection)
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.ok(ret.isNotFoundError)
    })
  })
})
