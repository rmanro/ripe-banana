const router = require('express').Router();
const Review = require('../models/Review');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (reviewer, id) => {
    if(!reviewer) {
        throw {
            status: 404,
            error: `Reviewer id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Review.findById(id)
            .populate({
                path: 'reviewer',
                select: 'name'
            })
            .lean()
            .then(review => {
                check404(review, id);
                res.json(review);
            })
            .catch(next);
    })