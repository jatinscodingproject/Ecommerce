const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('../config/db');
const model = require('../models/index');

const customerServices = {
    async importFromCSV(req, res) {
        const filePath = req.file.path;
        const customers = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const name = row[Object.keys(row)[0]]?.trim();
                    const whatsapp_number = row[Object.keys(row)[1]]?.trim();

                    if (name) {
                        customers.push({ name, whatsapp_number });
                    }
                })
                .on('end', async () => {
                    try {
                        await model.Customer.bulkCreate(customers);
                        fs.unlinkSync(filePath); // remove temp file
                        resolve({ msg: 'Customers imported successfully', result: 'pass' });
                    } catch (err) {
                        console.error('Error in bulkCreate:', err);
                        reject({ msg: 'Import failed', result: 'fail' });
                    }
                })
                .on('error', (err) => {
                    console.error('CSV Parsing Error:', err);
                    reject({ msg: 'Error reading CSV file', result: 'fail' });
                });
        });
    },

    async getCustomers(req, res) {
        try {
            const customers = await model.Customer.findAll({
                where: { deleted: false },
                order: [['createdAt', 'DESC']]
            });

            return { msg: 'Customer list fetched', result: 'pass', data: customers };
        } catch (err) {
            console.error('Error fetching customers:', err);
            return { msg: 'Failed to fetch customers', result: 'fail' };
        }
    }
};

module.exports = customerServices;
