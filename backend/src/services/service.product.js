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
                manufacture,
                description,
                usage_instruction,
                price,
                discount,
                gst_percent,
                quantity,
                minimum_order_qty,
                weight,
                dimension,
                material_used,
                age_recommendations,
                safety_instruction,
                tags,
                color,
                size,
                variant,
                battery_type,
                battery_required,
                battery_include,
                remote_range,
                remote_battery_info,
                frequency,
                choking_hazard,
                manfactured_in, 
                video_url,
                user_id,
                status,
                stock_status
            } = req.body;

            if (!title  || !price) {
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
                batteries_included: battery_include,
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
            

            if (req.files && req.files.length > 0) {
                const dir = path.join(__dirname, '..', 'images', title.replace(/\s+/g, '_'));
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                const imagePromises = req.files.map(file => {
                    const tempPath = file.path;
                    const ext = path.extname(file.originalname);
                    const finalName = Date.now() + '_' + Math.round(Math.random() * 1e9) + ext;
                    const finalPath = path.join(dir, finalName);

                    fs.renameSync(tempPath, finalPath);

                    const relativePath = path.relative(path.join(__dirname, '..'), finalPath).replace(/\\/g, '/');

                    return model.ProductImage.create({
                        product_id: newProduct.id,
                        image_url: relativePath,
                    }, { transaction: t });
                });

                await Promise.all(imagePromises);
            }

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
