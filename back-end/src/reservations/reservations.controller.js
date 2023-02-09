const reservationsService = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation ${req.params.reservation_id} cannot be found.`,
  });
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const reservation_id = req.query.reservation_id
  let data;
  if (date) {
    data = await reservationsService.listDate(date);
  } else if (mobile_number) {
    data = await reservationsService.search(mobile_number);
  } else if (reservation_id) {
    data = await reservationsService.read(reservation_id);
  } else {
    data = await reservationsService.list();
  }
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
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
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
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function mobileNumberIsValid(req, res, next){
  if(isNaN(req.body.data.mobile_number)){
  next({ status: 400, message: "mobile number cannot contain letters" });
  }

  next();
}

function hasPeople(req, res, next) {
  if (req.body.data.people >= 1 && typeof req.body.data.people !== "string") {
    return next();
  }
  next({ status: 400, message: "people must be a number greater than 1" });
}

function isValidDate(req, res, next) {
  let dateString = req.body.data.reservation_date;
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) {
    next({
      status: 400,
      message: "reservation_date must be in YYYY-MM-DD format",
    });
  }
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) {
    next({ status: 400, message: "reservation_date must be a valid date" });
  }
  return next();
}

function isDuringBusinessHours(req, res, next) {
  const time = req.body.data.reservation_time;
  const hour = Number(time.split(":")[0]);
  const minutes = Number(time.split(":")[1]);
  if (
    hour < 10 ||
    hour > 21 ||
    (hour === 10 && minutes < 30) ||
    (hour === 21 && minutes > 30)
  ) {
    next({
      status: 400,
      message: "time needs to be between 10:30 AM and 9:30 PM",
    });
  }
  return next();
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

function isFutureDate(req, res, next) {
  const combined =
    req.body.data.reservation_date + " " + req.body.data.reservation_time;
  let checkDate = new Date(combined);
  let today = new Date();

  if (process.env.NODE_ENV) {
    today = today.addHours(-6);
  }

  if (checkDate.getDay() === 2) {
    next({ status: 400, message: "we are closed on Tuesdays" });
  } else if (checkDate < today) {
    next({ status: 400, message: "date must be in the future" });
  }
  return next();
}

function isTimeString(req, res, next) {
  let str = req.body.data.reservation_time;
  regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;

  if (regexp.test(str)) {
    return next();
  } else {
    next({ status: 400, message: "reservation_time must be in HH:MM format" });
  }
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

const validStatuses = ["seated", "finished", "booked", "cancelled"];

function hasValidStatus(req, res, next) {
  const status = req.body.data.status;
  if (validStatuses.includes(status)) {
    return next();
  }

  next({
    status: 400,
    message: `unknown status request, must be 'seated', 'finished', or 'cancelled'`,
  });
}

function statusIsBooked(req, res, next) {
  const status = req.body.data.status;
  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `status of reservation cannot be ${status}`,
    });
  }
  next();
}

async function updateReservation(req, res) {
  const reservation_id = res.locals.reservation.reservation_id
  const updatedReservation = req.body.data

 await reservationsService.updateReservation(reservation_id, updatedReservation);
 const data = await reservationsService.read(reservation_id)
  res.status(200).json({ data });
}

async function updateReservationStatus(req, res, next) {
  const updatedStatus = req.body.data;
  const reservation = res.locals.reservation;

  if (reservation.status === "finished") {
    return next({ status: 400, message: `reservation is already finished` });
  }
  await reservationsService.updateReservationStatus(
    reservation.reservation_id,
    updatedStatus
  );
  const updatedReservation = await reservationsService.read(
    reservation.reservation_id
  );
  res.json({ data: updatedReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasPeople,
    mobileNumberIsValid,
    isValidDate,
    isTimeString,
    isFutureDate,
    isDuringBusinessHours,
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateReservationStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidStatus,
    asyncErrorBoundary(updateReservationStatus),
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasPeople,
    mobileNumberIsValid,
    isValidDate,
    isTimeString,
    isFutureDate,
    isDuringBusinessHours,
    statusIsBooked,
    asyncErrorBoundary(updateReservation),
  ],
};
