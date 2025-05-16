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
                title, sku, category_id, sub_category_id, brand,
                description, price, discount, gst_percent,
                quantity, minimum_order_qty, tags, color, more_info,
                video_url
            } = req.body;

            console.log(req.body)

            console.log(title, price)

            if (!title || !price) return { msg: "Required fields missing", result: "fail" };
            if (!validator.isDecimal(price.toString())) return { msg: "Invalid price format", result: "fail" };

            const newProduct = await model.Product.create({
                title,
                sku,
                category_id,
                sub_category_id,
                brand,
                description,
                price,
                discount,
                gst_percentage: gst_percent,
                quantity,
                min_order_quantity: minimum_order_qty,
                tags,
                color,
                more_information: more_info,
                video_url,
                status: true,
                stock_status: true,
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
                    console.log(relativePath)
                    return model.ProductImage.create({
                        product_id: newProduct.id,
                        image_url: relativePath,
                    }, { transaction: t });
                });

                await Promise.all(imagePromises);
            }

            if (req.files && req.files.video && req.files.video.length > 0) {
                try {
                    const video = req.files.video[0];
                    const videoDir = path.join(__dirname, '../uploads/videos', title.replace(/\s+/g, '_'));
                    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

                    const newVideoName = Date.now() + '-' + video.originalname;
                    const finalVideoPath = path.join(videoDir, newVideoName);
                    fs.renameSync(video.path, finalVideoPath);

                    const relativeVideoPath = path.relative(path.join(__dirname, '..'), finalVideoPath).replace(/\\/g, '/');
                    console.log(relativeVideoPath)
                    newProduct.video_url = relativeVideoPath;
                    await newProduct.save({ transaction: t });
                }catch(err){
                    console.log(err)
                }
            }
            await t.commit();
            return { msg: 'Product Added!', status: 'pass', data: newProduct };
        } catch (err) {
            console.log(err)
            if (t) await t.rollback();
            return { msg: 'Something went wrong', result: 'fail' };
        }
    },


    async getProducts(req, res) {
        try {
           
            const products = await model.Product.findAll();

            return { msg: 'Products fetched successfully', result: 'pass', data: products };

        } catch (err) {
            return { msg: 'Failed to fetch products', result: 'fail' };
        }
    }

};

module.exports = productServices;
