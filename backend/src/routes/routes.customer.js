const express = require('express');
const router = express.Router()
const customerController = require('../controllers/controller.customer')

router.post('/addCustomers',  customerController.customerController.importFromCSV)

router.get('/fetchCustomers', customerController.customerController.getCustomers)



module.exports = router