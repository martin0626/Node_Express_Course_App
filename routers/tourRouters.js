const express = require("express");

const controller = require('./../controllers/tourControllers')
const router = express.Router();


//Route to get first five most rated tours
router.route('/top-5-cheap')
    .get(controller.aliasTopTours, controller.getAllTours);


router.route('/tour-stats').get(controller.getStats)

//New routes
router.route('/')
    .get(controller.getAllTours)
    .post(controller.createTour);
router.route('/:id')
    .get(controller.getSingleTour)
    .patch(controller.updateTour)
    .delete(controller.deleteTour);

// OLD with chained Middleware - controller.checkTours
// router.route('/')
//     .get(controller.getAllTours)
//     .post(controller.checkTours, controller.createTour);
// router.route('/:id')
//     .get(controller.getSingleTour)
//     .patch(controller.updateTour)
//     .delete(controller.deleteTour);


module.exports = router;