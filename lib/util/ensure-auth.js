const tokenService = require('./token-service');

module.exports = function() {
    return (req, res, next) => {
        const token = req.get('Authorization');
        try {
            if(!token) return next({ status: 400, error: 'No Token Found' });
            const payload = tokenService.verify(token);
            req.user = payload;
            next();
        }
        catch (err) {
            next({
                status: 401,
                error: 'Invalid Token'
            });
        }
    };
};