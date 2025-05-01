const express = require('express');
const router = express.Router()
const productController = require('../controllers/controller.product')

router.post('/addProduct',  productController.productController.addProduct)

router.post('/fetchProduct',  productController.productController.getProduct)



module.exports = router