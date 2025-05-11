const express = require('express');
const router = express.Router();

const user = require('./routes.user');
const customer = require('./routes.customer');
const product = require('./routes.product');


router.use('/', user);
router.use('/',customer);
router.use('/',product);


module.exports = router