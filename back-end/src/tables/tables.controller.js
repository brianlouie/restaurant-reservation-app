const tablesService = require("./tables.service.js");
const reservationsService = require("../reservations/reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.body.data.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `reservation ${req.body.data.reservation_id} cannot be found.` });
}

async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `table cannot be found.` });
}

function hasReservationId(req, res, next) {
  const reservation_id = req.body.data.reservation_id
  if(isNaN(reservation_id)){
    return next({ status: 400, message: "reservation_id must be a number" }); 
  }
  next();
}

async function seatReservation(req, res, next) {
  const reservationId = req.body.data
  const {table} = res.locals
  const {reservation} = res.locals

  if(table.reservation_id){
    return next({ status: 400, message: "table is occupied" });
  }
  if(table.capacity < reservation.people){
    return next({ status: 400, message: "table does not have sufficient capacity" });
  }
  const update = await tablesService.seatReservation(reservationId, table.table_id)
  res.json({ data: update });
}

async function create(req, res) {
    const data = await tablesService.create(req.body.data);
    res.status(201).json({ data });
  }

  async function list(req, res) {
    const data = await tablesService.list();  
    res.json({
        data,
      });
    }

  function hasData(req, res, next) {
    if (req.body.data) {
      return next();
    }
    next({ status: 400, message: "body must have data property" });
  }
  
  const VALID_PROPERTIES = [
    "table_name",
    "capacity",
  ];
  
  function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_PROPERTIES.includes(field)
    );
  
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }
    next();
  }
  
  const hasProperties = require("../errors/hasProperties");
  const hasRequiredProperties = hasProperties(
    "table_name",
    "capacity",
  );
  const requestHasId = hasProperties(
    "reservation_id",
  )

function isValidName(req, res, next){
    const name = req.body.data.table_name
    if(name.length < 2){
        return next({ status: 400, message: "table_name has to be 2 characters or more" });
    }
    next();
}

function hasCapacity(req, res, next){
    const capacity = req.body.data.capacity
    if(capacity < 1 || typeof req.body.data.capacity !== "number"){
        return next({ status: 400, message: "capacity has to be 1 or higher" });
    }
    next();
}





module.exports = {
create: [
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    isValidName,
    hasCapacity,
    asyncErrorBoundary(create),
],
list: asyncErrorBoundary(list),
seatReservation: [
  hasData,
  hasReservationId,
  asyncErrorBoundary(reservationExists),
  asyncErrorBoundary(tableExists),
  requestHasId,
  asyncErrorBoundary(seatReservation),
]
}