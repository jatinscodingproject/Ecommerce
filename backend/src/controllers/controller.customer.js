const services = require('../services/service.customer');
const { HttpStatus } = require('../utils/utils.httpStatus')

const customerController = {
    async importFromCSV(req, res) {
        try {
            const result = await services.importFromCSV(req, res);
            res.status(result.result === 'pass' ? 201 : 400).json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getCustomers(req, res) {
        const result = await services.getCustomers(req, res);
        res.status(result.result === 'pass' ? 200 : 400).json(result);
    },

}

module.exports = {
    customerController
}