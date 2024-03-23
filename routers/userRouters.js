const express = require("express");

const controller = require('./../controllers/userControllers')
const authController = require('./../controllers/authControllers')
const router = express.Router();



//Auth User Controllers
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/changePassword', authController.updatePassword);

//Users controllers
router.patch('/updateUser', authController.protect, controller.updateUser);


router.route('/')
    .get(controller.getAllUsers)
    .post(controller.createUser);
router.route('/')
    .get(controller.getSingleUser)
    .delete(controller.deleteUser);


module.exports = router;