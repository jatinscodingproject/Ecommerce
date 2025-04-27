const bcrypt = require('bcrypt')


const hashedValue = {
    async generatehashPass(password) {
        const saltRounds = 10;
        if (!password) {
            throw new Error('Password is required for hashing');
        }
        const hashedPasswords = await bcrypt.hash(password, saltRounds);
        return hashedPasswords;
    },

    async comparehashPass(password, hashedPassword) {
        if (!password || !hashedPassword) {
            throw new Error('Both password and hashedPassword are required for comparison');
        }
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
        return isPasswordMatch;
    }
};

module.exports = {
    hashedValue
};
