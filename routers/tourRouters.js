const express = require("express");

const controller = require('./../controllers/tourControllers')
const router = express.Router();

router.param('id', controller.checkId)


router.route('/')
    .get(controller.getAllTours)
    .post(controller.checkTours, controller.createTour);
router.route('/:id')
    .get(controller.getSingleTour)
    .patch(controller.updateTour)
    .delete(controller.deleteTour);


module.exports = router;