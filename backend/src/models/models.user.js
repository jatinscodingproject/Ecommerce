const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { forgetPasswordotp } = require('../services/services.user');

const User = sequelize.define('user', {
    UserId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    forgetPasswordotp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otptime : {
        type: DataTypes.DATE,
        allowNull: true
    },
    expiresIn:{
        type: DataTypes.DATE,
        allowNull : true
    }
}, {
    timestamps: true,
});

module.exports = User;
