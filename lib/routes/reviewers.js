const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
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
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Reviewer.findById(id)
                .lean(),
            
            Review.find({ reviewers: id })
                .lean()
                .select('rating review')
                .populate({
                    path: 'reviewer',
                    select: 'name'
                })
        ])
            .then(([reviewer, reviews]) => {
                check404(reviewer, id);
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
            .catch(next);   
    })

    .put('/:id', (req, res, next) => {
        const { id } = req.params;

        Reviewer.findByIdAndUpdate(id, req.body, updateOptions)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find(req.query)
            .lean()
            .select('name company')
            .then(reviewers => res.json(reviewers))
            .catch(next);
    });