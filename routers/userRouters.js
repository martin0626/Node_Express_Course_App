const express = require("express");

const controller = require('./../controllers/userControllers')
const authController = require('./../controllers/authControllers')
const router = express.Router();


router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword);



router.route('/')
    .get(controller.getAllUsers)
    .post(controller.createUser);
router.route('/:id')
    .get(controller.getSingleUser)
    .patch(controller.updateUser)
    .delete(controller.deleteUser);


module.exports = router;