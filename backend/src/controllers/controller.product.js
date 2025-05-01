const services = require('../services/service.product');
const { HttpStatus } = require('../utils/utils.httpStatus')

const productController = {
    async addProduct(req, res) {
        const result = await services.addProduct(req, res);
        res.status(result.result === 'pass' ? 201 : 400).json(result);
    },

    async getProduct(req, res) {
        const result = await services.getProducts(req, res);
        res.status(result.result === 'pass' ? 200 : 400).json(result);
    },

}

module.exports = {
    productController
}