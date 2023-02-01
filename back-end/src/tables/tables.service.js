const knex = require("../db/connection");

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function list() {
  return knex("tables").select("*").orderBy('table_name');
}

function seatReservation(reservation_id, table_id) {
  return knex("tables")
    .where({ table_id: table_id})
    .update(reservation_id);
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}


module.exports = {
    create,
    list,
    read,
    seatReservation,
};