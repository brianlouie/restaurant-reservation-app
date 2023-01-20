const reservationsService = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const date = req.query.date;
  let data;
  if (date) data = await reservationsService.listDate(date);
  else {
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

function hasPeople(req, res, next) {
  const people = Number(req.body.data.people);
if (people >= 1 && typeof req.body.data.people !== "string") {
    return next();
  }
  next({ status: 400, message: "people must be a number greater than 1" });
}

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}

function isDate(req, res, next) {
  const date = req.body.data.reservation_date
  if (isValidDate(date)) {
    return next();
  }
  next({ status: 400, message: "reservation_date must be in YYYY-MM-DD format" });
}

function is_timeString(str)
{
 regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  
        if (regexp.test(str))
          {
            return true;
          }
        else
          {
            return false;
          }
}

function isTime(req, res, next){
  const time = req.body.data.reservation_time
  if(is_timeString(time)) {
    return next();
  }
  next({ status: 400, message: "reservation_time must be in HH:MM format" });  
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasPeople,
    isDate,
    isTime,
    asyncErrorBoundary(create),
  ],
};
