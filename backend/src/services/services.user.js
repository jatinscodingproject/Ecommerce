require('dotenv').config()
const { HttpStatus } = require('../utils/utils.httpStatus');
const model = require('../models/index');
const { CustomError } = require('../utils/utils.error');
const sequelize = require('../config/db');
// const { generateSecretTokenUser } = require('../middleware/middleware.jwt')
const { hashedValue } = require('../utils/utils.generatehashPassword')
const { userVerification } = require('../utils/utils.userverification');
const { where } = require('sequelize');
const { Op } = require('sequelize');

const userServices = {
    async addUser(req, res) {
        const t = await sequelize.transaction()
        try {
            const { FName, LName, email , password, username , AccountTypeID } = req.body;
            const checking_user_email = await model.User.findOne({
                where: {
                    email: email,
                }
            }, { transaction: t });
            
            const checking_user = await model.User.findOne({
                where: {
                    Username: username,
                }
            }, { transaction: t });
            let message;
            if (checking_user_email) {
                return {msg:"Email Already Exists" , result:"fail"}
            }else if(checking_user){
                return {msg:"Username Already Exists" , result:"fail"}
            } else {
                message = "User added";
                hashedPasswords = await hashedValue.generatehashPass(password)
                const newUser = await model.User.create({
                    FName: FName,
                    Username: username,
                    LName: LName,
                    email: email,
                    password: hashedPasswords,
                    isVerified: false,
                    isActive: false,
                    isConfirmed: false,
                    AccountTypeID: AccountTypeID
                }, { transaction: t });
                const user = newUser.get({ plain: true });
                userVerification.sendEmailOTP(email)
            }
            await t.commit()
            return { msg: 'User Added and Verification otp sent' , result:"pass" }
        } catch (err) {
            if (t) await t.rollback();
            return {msg:"Something Went Wrong" , result:"fail"}
        }
    },

    async getUser(req, res) {
        let t;
        try {
            const { username } = req.body;
            t = await sequelize.transaction();
    
            const user = await model.User.findOne({ where: { Username: username } });
            if (!user) {
                await t.rollback();
                return { msg: 'User not found', result:"fail" };
            }
    
            let Users;
            if (user.AccountTypeID === 2) {
                Users = await model.User.findAll({ where: { createdBy: username } });
            } else if (user.AccountTypeID === 1) {
                Users = await model.User.findAll({
                    where: {
                      AccountTypeID: {
                        [Op.ne]: 1
                      }
                    }
                  });
            } else {
                await t.rollback();
                return { msg: 'Invalid AccountTypeID' , result:"fail"}
            }

    
            await t.commit();
            return { msg: 'Users fetched successfully', Users , result:"pass"};
        } catch (err) {
            if (t) await t.rollback();
            return { msg: "something went wrong" , result:"fail" }
        }
    },

    async userLogging(req, res) {
        const { username, password } = req.body;
        try {
            const user = await model.User.findOne({ where: { Username: username } });
            if (!user) {
                return {msg:"User Does not Exists", result:"fail"}
            }

            const isPasswordMatch = await hashedValue.comparehashPass(password, user.password)
            if (!isPasswordMatch) {
                return {msg:"Password is Wrong" , result:"fail"}
            }
            if (user.AccountTypeID === 1){
                return {msg:"Account not found",  result:'fail'}
            }

            if(user.isPasswordChange === true){
                 return {msg:"First Time Logging Kindly Change Password" , result : "true" , activity : 'changePassword'}
            }

            if(user.isActive === false){
                return {msg:"Your Account is not active" , result:"fail"}
            }

            const token = generateSecretTokenUser(user.UserId)
            
            const pages = await model.PageAccess.findAll({
                where:{
                    AccountTypeID:user.AccountTypeID,
                    hasAcess:true
                }   
            })
            return {msg:'Logging Successfully', token , result:"pass", pages , 'username' : user.Username , 'type' : user.AccountTypeID}
        } catch (err) {
            return {msg:"Something Went Wrong" , result:"fail"}
        }
    },

    async changePassword(req, res) {
        const { userName , op, np} = req.body;
        try {
            const user = await model.User.findOne({ where: { Username: userName } });;
    
            if (!user) {
                return {msg:"User Does not Exists", result:"fail"}
            }
    
            const isOldPasswordMatch = await hashedValue.comparehashPass(op, user.password);
            if (!isOldPasswordMatch) {
                return {msg:"Please Enter Correct Old Password" , result:"fail"};
            }
    
            const hashedPassword = await hashedValue.generatehashPass(np);
    
            user.password = hashedPassword;
            user.isPasswordChange = false;
            await user.save();
    
            return { msg: "Password changed successfully", result: "pass" };
        } catch (err) {
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
        const { email, npass , cotp } = req.body;
    
        const t = await sequelize.transaction();
        try {
            const user = await model.User.findOne({
                where: {
                    email: email,
                    generatedEmailOtp: cotp
                },
                transaction: t
            });
    
            if (!user) {
                await t.rollback();
                return { msg: 'Invalid OTP', result: "fail" };
            }
    
            const hashedNewPassword = await hashedValue.generatehashPass(npass);
    
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

    async userLogout(req,res){
        const {userToken} = req.body 
        const t = await sequelize.transaction()
        try{

            const tokenpresent = model.token.destroy({
                where : {token:userToken} 
            })

            return {msg:"User Logout", result:"pass"}
        }catch{
            if (t) await t.rollback();
            return { msg: "Something Went Wrong", result: "fail" };
        }
    },
}



module.exports = userServices