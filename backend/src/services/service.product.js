require('dotenv').config();
const { HttpStatus } = require('../utils/utils.httpStatus');
const model = require('../models/index');
const { CustomError } = require('../utils/utils.error');
const sequelize = require('../config/db');
const validator = require('validator');
const path = require('path');
const fs = require('fs');


const productServices = {


    async addProduct(req, res) {
        const t = await sequelize.transaction();
        try {
            const {
                title, sku, category_id, sub_category_id, brand, manufacture,
                description, usage_instruction, price, discount, gst_percent,
                quantity, minimum_order_qty, weight, dimension, material_used,
                age_recommendations, safety_instruction, tags, color, size, variant,
                battery_type, battery_required, battery_include, remote_range,
                remote_battery_info, frequency, choking_hazard, manfactured_in,
                video_url, user_id, status, stock_status
            } = req.body;

            if (!title || !price) return { msg: "Required fields missing", result: "fail" };
            if (!validator.isDecimal(price.toString())) return { msg: "Invalid price format", result: "fail" };

            const newProduct = await model.Product.create({
                title,
                sku,
                category_id,
                sub_category_id,
                brand,
                manufacturer: manufacture,
                description,
                usage_instructions: usage_instruction,
                price,
                discount,
                gst_percentage: gst_percent,
                quantity,
                min_order_quantity: minimum_order_qty,
                weight,
                dimension,
                material_used,
                age_recommendations,
                safety_instructions: safety_instruction,
                tags,
                color,
                size,
                variant,
                battery_type,
                number_of_batteries: battery_required,
                batteries_included: battery_include === 'true',
                remote_range,
                remote_battery_info,
                frequency,
                choking_hazard_warning: choking_hazard,
                manufactured_by: manufacture,
                manufactured_in: manfactured_in,
                video_url,
                user_id,
                status,
                stock_status,
                deleted: false
            }, { transaction: t });

            if (req.files && req.files.images && req.files.images.length > 0) {
                const imageDir = path.join(__dirname, '../uploads/products', title.replace(/\s+/g, '_'));

                if (!fs.existsSync(imageDir)) {
                    fs.mkdirSync(imageDir, { recursive: true });
                }

                const imagePromises = req.files.images.map(file => {

                    const ext = path.extname(file.originalname);
                    const newFileName = Date.now() + '-' + file.originalname;
                    const finalPath = path.join(imageDir, newFileName);

                    fs.renameSync(file.path, finalPath);

                    const relativePath = path.relative(path.join(__dirname, '..'), finalPath).replace(/\\/g, '/');

                    return model.ProductImage.create({
                        product_id: newProduct.id,
                        image_url: relativePath,
                    }, { transaction: t });
                });

                await Promise.all(imagePromises);
            }

            if (req.files && req.files.video && req.files.video.length > 0) {
                const video = req.files.video[0];
                const videoDir = path.join(__dirname, '../uploads/videos', title.replace(/\s+/g, '_'));
                if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

                const newVideoName = Date.now() + '-' + video.originalname;
                const finalVideoPath = path.join(videoDir, newVideoName);
                fs.renameSync(video.path, finalVideoPath);

                const relativeVideoPath = path.relative(path.join(__dirname, '..'), finalVideoPath).replace(/\\/g, '/');
                newProduct.video_url = relativeVideoPath;
                await newProduct.save({ transaction: t });
            }
            await t.commit();
            return { msg: 'Product Added!', result: 'pass', data: newProduct };
        } catch (err) {
           
            if (t) await t.rollback();
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
            return { msg: 'Failed to fetch products', result: 'fail' };
        }
    }

};

module.exports = productServices;
