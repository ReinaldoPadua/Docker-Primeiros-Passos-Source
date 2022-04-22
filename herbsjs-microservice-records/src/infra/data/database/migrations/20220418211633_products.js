
exports.up = async function (knex) {
    knex.schema.hasTable('products')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('products', function (table) {
                    table.integer('id').primary()
                    table.string('description')
                    table.integer('value')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('products')
}
