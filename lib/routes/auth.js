const router = require('express').Router();
const { respond } = require('./route-helpers');
const Reviewer = require('../models/Reviewer');
const { sign, verify } = require('../util/token-service');

const hasEmailAndPassword = ({ body }, res, next) => {
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
    .post('/signup', hasEmailAndPassword, respond(
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
    ))

    .post('/signin', hasEmailAndPassword, respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return Reviewer.findOne({ email })
                .then(user => {
                    if(!user || !user.comparePassword(password)) {
                        throw {
                            status: 401,
                            error: 'Invalid Email or Password'
                        };
                    }

                    return { token: sign(user) };
                });
        }
    ))

    

    .post('/verify', (req, res, next) => {
        const id = verify(req.body.token).id;
        return Reviewer.findById(id)
            .lean()
            .then(user => {
                if(!user._id) {
                    throw {
                        status: 401,
                        error: 'Invalid Token'
                    };
                }
                res.send ({
                    status: 200,
                    message: 'Valid Token'
                });
            })
            .catch(next);
    
    });