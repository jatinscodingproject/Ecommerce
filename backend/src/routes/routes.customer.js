const express = require('express');
const router = express.Router()
const customerController = require('../controllers/controller.customer')

router.post('/addProduct',  customerController.customerController.importFromCSV)

router.get('/fetchProduct', customerController.customerController.getCustomers)



module.exports = router