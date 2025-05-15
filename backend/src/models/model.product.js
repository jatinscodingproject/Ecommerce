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
    manufacturer: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    usage_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    gst_percentage: {
        type: DataTypes.DECIMAL(5, 2),
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
    weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    dimension: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    material_used: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    age_recommendations: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    safety_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tags: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    size: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    variant: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    battery_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    number_of_batteries: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    batteries_included: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    remote_range: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    remote_battery_info: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    frequency: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    choking_hazard_warning: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    manufactured_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    manufactured_in: {
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
