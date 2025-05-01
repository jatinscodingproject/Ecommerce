require('dotenv').config();
const { HttpStatus } = require('../utils/utils.httpStatus');
const model = require('../models/index');
const { CustomError } = require('../utils/utils.error');
const sequelize = require('../config/db');
const validator = require('validator');

const productServices = {

    async addProduct(req, res) {
        const t = await sequelize.transaction();
        try {
            const {
                title,
                sku,
                category_id,
                sub_category_id,
                brand,
                manufacturer,
                description,
                usage_instructions,
                price,
                discount,
                gst_percentage,
                quantity,
                min_order_quantity,
                weight,
                dimension,
                material_used,
                age_recommendations,
                safety_instructions,
                tags,
                color,
                size,
                variant,
                battery_type,
                number_of_batteries,
                batteries_included,
                remote_range,
                remote_battery_info,
                frequency,
                choking_hazard_warning,
                manufactured_by,
                manufactured_in,
                video_url,
                user_id,
                status,
                stock_status
            } = req.body;

            if (!title || !category_id || !price) {
                return { msg: "Required fields missing", result: "fail" };
            }

            if (!validator.isDecimal(price.toString())) {
                return { msg: "Invalid price format", result: "fail" };
            }

            const newProduct = await model.Product.create({
                title,
                sku,
                category_id,
                sub_category_id,
                brand,
                manufacturer,
                description,
                usage_instructions,
                price,
                discount,
                gst_percentage,
                quantity,
                min_order_quantity,
                weight,
                dimension,
                material_used,
                age_recommendations,
                safety_instructions,
                tags,
                color,
                size,
                variant,
                battery_type,
                number_of_batteries,
                batteries_included,
                remote_range,
                remote_battery_info,
                frequency,
                choking_hazard_warning,
                manufactured_by,
                manufactured_in,
                video_url,
                user_id,
                status,
                stock_status,
                deleted: false
            }, { transaction: t });

            await t.commit();
            return { msg: 'Product Added!', result: 'pass', data: newProduct };

        } catch (err) {
            if (t) await t.rollback();
            console.error('Error adding product:', err);
            return { msg: 'Something went wrong', result: 'fail' };
        }
    },

    async getProducts(req, res) {
        try {
            const { search, category_id, status } = req.query;

            const whereClause = { deleted: false };

            if (search) {
                whereClause.title = { [Op.like]: `%${search}%` };
            }

            if (category_id) {
                whereClause.category_id = category_id;
            }

            if (status !== undefined) {
                whereClause.status = status;
            }

            const products = await model.Product.findAll({ where: whereClause });

            return { msg: 'Products fetched successfully', result: 'pass', data: products };

        } catch (err) {
            console.error('Error fetching products:', err);
            return { msg: 'Failed to fetch products', result: 'fail' };
        }
    }

};

module.exports = productServices;
