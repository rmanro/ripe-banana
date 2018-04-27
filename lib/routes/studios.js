const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');
const createEnsureAdmin = require('../util/ensure-admin');
const ensureAdmin = createEnsureAdmin();
// const { verify } = require('../../lib/util/token-service');


const check404 = (studio, id) => {
    if(!studio) {
        throw {
            status: 404,
            error: `Studio ID ${id} Does Not Exist`
        };
    }
};

module.exports = router

    .post('/', ensureAdmin, (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find(req.query)
            .lean()
            .select('name')
            .then(studios => res.json(studios))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        const { id } = req.params; 
        Promise.all([
            Studio.findById(id)
                .lean(),

            Film.find({ 'studio': id })
                .select('title')
                .lean()
        ])
            .then(([studio, films]) => {
                check404(studio, id);
                studio.films = films;
                res.json(studio);
            })
            .catch(next);
    })
    
    .delete('/:id', ensureAdmin, (req, res, next) => {
        const { id } = req.params;
        return Film.find({ 'studio': id })
            .then((result) => {
                if(result.length > 0) {
                    res.json({ removed: false });
                } else {
                    return Studio.findByIdAndRemove(id)
                        .then(removed => res.json({ removed }));
                }
            })
            .catch(next);
    
    });