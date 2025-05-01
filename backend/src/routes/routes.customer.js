const express = require('express');
const router = express.Router()
const customerController = require('../controllers/controller.customer')

router.post('/addProduct',  productController.productController.addProduct)

router.post('/fetchProduct',  productController.productController.getProduct)



module.exports = router