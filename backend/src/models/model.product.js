const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    category_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    sub_category_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    more_information: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gst_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    min_order_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    tags: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    video_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    stock_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'products',
});

module.exports = Product;
