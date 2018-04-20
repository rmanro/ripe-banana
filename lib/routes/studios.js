const router = require('express').Router();
const Studio = require('../models/Studio');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (studio, id) => {
    if(!studio) {
        throw {
            status: 404,
            error: `Studio ID ${id} Does Not Exist`
        };
    }
};

module.exports = router

    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find(req.query)
            .lean()
            .then(studios => res.json(studios))
            .catch(next);
    });