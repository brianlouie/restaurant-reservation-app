/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").post(controller.create).get(controller.list);
router.route("/:table_id/seat").put(controller.seatReservation).delete(controller.clearTable)

module.exports = router;