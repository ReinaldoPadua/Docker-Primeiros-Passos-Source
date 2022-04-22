
exports.up = async function (knex) {
    knex.schema.hasTable('clients')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('clients', function (table) {
                    table.integer('id').primary()
                    table.string('name')
                    table.string('email')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('clients')
}
