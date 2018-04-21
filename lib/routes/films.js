const router = require('express').Router();
const Film = require('../models/Film');
const Actor = require('../models/Actor');
const Studio = require('../models/Studio');
const { updateOptions } = require('../util/mongoose-helpers');

module.exports = router

    .post('/', (req, res, next) => {
        console.log('REQUESTBODY', req.body);
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film.find(req.query)
            .lean()
            .select('title released studio')
            .then(films => res.json(films))
            .catch(next);
    });