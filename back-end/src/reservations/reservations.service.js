const { andWhere } = require("../db/connection");
const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function list() {
  return knex("reservations").select("*");
}

async function listDate(date) {
  return knex("reservations").select("*").where({ reservation_date: date }).whereNot({ status: "finished"}).orderBy('reservation_time')
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id: reservation_id }).first();
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


function updateReservationStatus(reservation_id, new_status) {
  return knex("reservations")
    .where({ reservation_id: reservation_id})
    .update(new_status);
}

module.exports = {
  create,
  list,
  listDate,
  read,
  updateReservationStatus,
  search,
};
