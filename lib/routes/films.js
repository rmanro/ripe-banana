const router = require('express').Router();
const Film = require('../models/Film');
const Actor = require('../models/Actor');
const Studio = require('../models/Studio');
const { updateOptions } = require('../util/mongoose-helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film.find(req.query)
            .lean()
            .select('title released studio')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .then(films => res.json(films))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });