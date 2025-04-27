require('dotenv').config()
const { HttpStatus } = require('../utils/utils.httpStatus');
const model = require('../models/index');
const { CustomError } = require('../utils/utils.error');
const sequelize = require('../config/db');
const { generateSecretTokenUser } = require('../middleware/middleware.jwt')
const { hashedValue } = require('../utils/utils.generatehashPassword')
const { userVerification } = require('../utils/utils.userverification');
const { where } = require('sequelize');
const { Op } = require('sequelize');
const validator = require('validator');
const moment = require('moment-timezone');

const userServices = {

    async addUser(req, res) {
        const t = await sequelize.transaction();
        try {
            const { name, email, password } = req.body;

            if (!validator.isEmail(email)) {
                return { msg: "Invalid Email Format", result: "fail" };
            }


            const checking_user_email = await model.User.findOne({
                where: { email: email }
            }, { transaction: t });

            if (checking_user_email) {
                return { msg: "Email Already Exists", result: "fail" };
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return {
                    msg: "Invalid Password Format. It must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be minimum 8 characters long.",
                    result: "fail"
                };
            }


            const hashedPasswords = await hashedValue.generatehashPass(password);

            const newUser = await model.User.create({
                name: name,
                email: email,
                password: hashedPasswords,
            }, { transaction: t });

            await t.commit();
            return { msg: 'User Added!', result: "pass" };

        } catch (err) {
            if (t) await t.rollback();
            console.error('Error adding user:', err);
            return { msg: "Something Went Wrong", result: "fail" };
        }
    },


    async userLogging(req, res) {
        const { email, password } = req.body;
        try {
            if (!validator.isEmail(email)) {
                return { msg: "Invalid Email Format", result: "fail" };
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return {
                    msg: "Invalid Password Format. It must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be minimum 8 characters long.",
                    result: "fail"
                };
            }

            const user = await model.User.findOne({ where: { email: email } });
            if (!user) {
                return { msg: "User Does Not Exist", result: "fail" };
            }

            const isPasswordMatch = await hashedValue.comparehashPass(password, user.password);
            if (!isPasswordMatch) {
                return { msg: "Password is Wrong", result: "fail" };
            }

            const token = generateSecretTokenUser(user.UserId);

            return { msg: 'Logged in Successfully', token, result: "pass" };

        } catch (err) {
            console.error('Login error:', err);
            return { msg: "Something Went Wrong", result: "fail" };
        }
    },


    async changePassword(req, res) {
        const { email, op, np } = req.body;
        try {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(np)) {
                return {
                    msg: "New Password must be minimum 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character",
                    result: "fail"
                };
            }

            const user = await model.User.findOne({ where: { email: email } });

            if (!user) {
                return { msg: "User Does Not Exist", result: "fail" };
            }

            const isOldPasswordMatch = await hashedValue.comparehashPass(op, user.password);
            if (!isOldPasswordMatch) {
                return { msg: "Please Enter Correct Old Password", result: "fail" };
            }

            const hashedPassword = await hashedValue.generatehashPass(np);

            user.password = hashedPassword;
            user.isPasswordChange = false;
            await user.save();

            return { msg: "Password changed successfully", result: "pass" };

        } catch (err) {
            console.error('Change Password Error:', err);
            return { msg: "Something went wrong", result: "fail" };
        }
    },


    async forgetPasswordotp(req, res) {
        const { email } = req.body;
        try {
            const user = await model.User.findOne({ where: { email: email } });

            if (!user) {
                return { msg: "User Does not Exist", result: "fail" };
            }

            await userVerification.sendEmailOTP(email);

            return { msg: "OTP Sent to Email", result: "pass" };
        } catch (err) {
            return { msg: "Something went wrong", result: "fail" };
        }
    },

    async forgetPasswordset(req, res) {
        const { email, password, otp } = req.body;

        const t = await sequelize.transaction();
        try {
            const user = await model.User.findOne({
                where: {
                    email: email,
                    forgetPasswordotp: otp
                },
                transaction: t
            });

            if (!user) {
                await t.rollback();
                return { msg: 'Invalid OTP', result: "fail" };
            }

            const currentTime = moment().tz('Asia/Kolkata');

            const expiresIn = moment(user.expiresIn).tz('Asia/Kolkata');

            if (currentTime.isAfter(expiresIn)) {
                await t.rollback();
                return { msg: 'Your OTP has expired', result: "fail" };
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return {
                    msg: "Invalid Password Format. It must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be minimum 8 characters long.",
                    result: "fail"
                };
            }

            const hashedNewPassword = await hashedValue.generatehashPass(password);

            await user.update({
                password: hashedNewPassword
            }, { transaction: t });

            await t.commit();

            return { msg: "Password changed successfully", result: "pass" };
        } catch (err) {
            if (t) await t.rollback();
            return { msg: "Something went wrong", result: "fail" };
        }
    },


    async userLogout(req, res) {
        const { userToken } = req.body
        const t = await sequelize.transaction()
        try {

            const tokenpresent = model.token.destroy({
                where: { token: userToken }
            })

            return { msg: "User Logout", result: "pass" }
        } catch {
            if (t) await t.rollback();
            return { msg: "Something Went Wrong", result: "fail" };
        }
    },
}



module.exports = userServices