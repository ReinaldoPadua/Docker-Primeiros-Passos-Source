
exports.up = async function (knex) {
    knex.schema.hasTable('orders')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('orders', function (table) {
                    table.integer('id').primary()
                    table.integer('client_id')
                    table.integer('product_id')
                    table.integer('quantity')
                    table.integer('value')
                    table.foreign('client_id').references('client.id');
                    table.foreign('product_id').references('product.id');
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('orders')
}
