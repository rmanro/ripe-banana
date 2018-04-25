const router = require('express').Router();
const { respond } = require('./route-helpers');
const Reviewer = require('../models/Reviewer');
const { sign } = require('../util/token-service');

const hadEmailAndPassword = ({ body }, res, next) => {
    const { email, password } = body;
    if(!email || !password) {
        throw {
            status: 400,
            error: 'Email and Password are Required'
        };
    }
    next();
};

module.exports = router
    .post('/signup', hadEmailAndPassword, respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;
            return Reviewer.exists({ email })
                .then(exists => {
                    if(exists) {
                        throw {
                            status: 400,
                            error: 'Email Exists'
                        };
                    }
                    const user = new Reviewer(body);
                    user.generateHash(password);
                    return user.save();
                })
                .then(user => {
                    return { token: sign(user) };
                });
        }
    ));