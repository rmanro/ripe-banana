const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET || 'secretpass';

module.exports = {
    
    sign(user) {
        const payload = {
            id: user._id,
        };

        return jwt.sign(payload, APP_SECRET);
    },

    verify(token) {
        return jwt.verify(token, APP_SECRET);
    }

};