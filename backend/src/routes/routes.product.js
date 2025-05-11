const express = require('express');
const router = express.Router()
const productController = require('../controllers/controller.product')
const upload = require('../middleware/middleware.upload');

router.post('/add-product', upload.array('images'), productController.productController.addProduct)

router.get('/fetchProduct',  productController.productController.getProduct)

module.exports = router