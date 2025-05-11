const express = require('express');
const router = express.Router()
const productController = require('../controllers/controller.product')
const upload = require('../middleware/upload');

router.post('/addProduct', upload.array('images'), productController.productController.addProduct)

router.get('/fetchProduct',  productController.productController.getProduct)



module.exports = router