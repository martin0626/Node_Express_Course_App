const express = require("express");

const controller = require('./../controllers/tourControllers');
const authController = require('./../controllers/authControllers');
const router = express.Router();



//Route to get first five most rated tours
router.route('/top-5-cheap')
    .get(controller.aliasTopTours, controller.getAllTours);


router.route('/tour-stats').get(controller.getStats)
router.route('/monthly-plan/:year').get(controller.getMounthlyPlan)


//New routes
router.route('/')
    .get(authController.protect, controller.getAllTours)
    .post(controller.createTour);
router.route('/:id')
    .get(controller.getSingleTour)
    .patch(controller.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), controller.deleteTour);

module.exports = router;