const express = require('express');
const router = express.Router()
const productController = require('../controllers/controller.product')
const upload = require('../middleware/middleware.upload');

router.post('/add-product', upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }  
]), productController.productController.addProduct);

router.get('/fetchProduct',  productController.productController.getProduct)

module.exports = router