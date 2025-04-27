const services = require('../services/services.user');
const { Resendotp, changePassword, forgetPasswordotp, forgetPasswordset, changePasswordFirstLogging } = require('../services/services.user');
const { HttpStatus } = require('../utils/utils.httpStatus')

const userController = {
    async addUser(req, res) {
        const response = await services.addUser(req, res);
        return res.status(HttpStatus.CREATED).json(response);
    },

    async UserLogging(req, res) {
        const response = await services.userLogging(req, res);
        return res.status(HttpStatus.OK).json(response);
    },

    async changePassword(req, res) {
        const response = await services.changePassword(req, res);
        return res.status(HttpStatus.OK).json(response);
    },


    async logout(req, res) {
        const response = await services.userServices.userLogout(req, res);
        return res.status(HttpStatus.OK).json(response);
    },

    async forgetPasswordotp(req, res) {
        const response = await services.forgetPasswordotp(req, res);
        return res.status(HttpStatus.OK).json(response);
    },
    
    async forgetPasswordset(req, res) {
        const response = await services.userServices.forgetPasswordset(req, res);
        return res.status(HttpStatus.OK).json(response);
    },


}

module.exports = {
    userController
}