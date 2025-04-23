const express = require('express');
const router = express.Router()
const userController = require('../controllers/controller.user')
// const checkTokenMiddleware = require('../middleware/middlware.checkToken')

router.post('/addUser',  userController.userController.addUser)

router.post('/fetchUser' ,  userController.userController.fetchUser)

router.post('/login' , userController.userController.UserLogging)

router.post('/changePassword' , userController.userController.changePassword)

router.post(`/editUser/:userID` , userController.userController.editUser)

router.post(`/logout`, userController.userController.logout);

router.post(`/fpo`, userController.userController.forgetPasswordotp)

router.post(`/fpc`, userController.userController.forgetPasswordset)



module.exports = router