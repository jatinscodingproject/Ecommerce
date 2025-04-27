require('dotenv').config();
const https = require('https');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const sequelize = require('../config/db');
const model = require('../models/index')
const { HttpStatus } = require('./utils.httpStatus')
const { Op } = require('sequelize');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const userVerification = {
    async sendEmailOTP(email) {
        const t = await sequelize.transaction();
        try {
            const otp = generateOTP();

            const otptime = new Date();
            const expiresIn = new Date(otptime.getTime() + 10 * 60000);

            await model.User.update(
                {
                    forgetPasswordotp: otp,
                    otptime: otptime,
                    expiresIn: expiresIn
                },
                {
                    where: { email: email },
                    transaction: t
                }
            );

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.User,
                    pass: process.env.APP_Password
                }
            });

            let info = await transporter.sendMail({
                from: '"Your Name" <your.email@example.com>',
                to: email,
                subject: "Email Verification OTP",
                html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f9;
                                padding: 20px;
                                margin: 0;
                            }
                            .container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #fff;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                            }
                            .header {
                                background-color: #4CAF50;
                                padding: 20px;
                                text-align: center;
                                color: #fff;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            .content {
                                padding: 30px;
                                text-align: center;
                            }
                            .otp {
                                font-size: 36px;
                                font-weight: bold;
                                color: #4CAF50;
                                margin-top: 20px;
                            }
                            .footer {
                                background-color: #f1f1f1;
                                padding: 10px;
                                text-align: center;
                                font-size: 14px;
                                color: #555;
                            }
                            .footer a {
                                color: #4CAF50;
                                text-decoration: none;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                OTP for Email Verification
                            </div>
                            <div class="content">
                                <p>Dear User,</p>
                                <p>Here is your OTP for verifying your email address:</p>
                                <div class="otp">${otp}</div>
                                <p>This OTP is valid for 10 minutes.</p>
                            </div>
                            <div class="footer">
                                <p>If you did not request this, please ignore this email.</p>
                                <p>Need help? <a href="mailto:support@example.com">Contact Support</a></p>
                            </div>
                        </div>
                    </body>
                </html>`
            });

            await t.commit();
            return { msg: "User mail sent successfully", result: "pass" };
        } catch (err) {
            console.log(err)
            if (t) await t.rollback();
            return { msg: err.message, result: "fail" };
        }
    }
};

module.exports = {
    userVerification
};
