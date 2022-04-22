const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const Client = require('../../../domain/entities/client')
const connection = require('../database/connection')

class ClientRepository extends Repository {
    constructor(injection) {
        super({
            entity: Client,
            table: "clients",
            knex: connection
        })
    }
}

module.exports =
    herbarium.repositories
        .add(ClientRepository, 'ClientRepository')
        .metadata({ entity: Client })
        .repository