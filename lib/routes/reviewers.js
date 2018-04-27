const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
const { updateOptions } = require('../util/mongoose-helpers');
const createEnsureAdmin = require('../util/ensure-admin');
const ensureAdmin = createEnsureAdmin();

const check404 = (reviewer, id) => {
    if(!reviewer) {
        throw {
            status: 404,
            error: `Reviewer id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', ensureAdmin, (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Reviewer.findById(id)
                .lean(),
            
            Review.find({ reviewer: id })
                .lean()
                .select('rating review')
                .populate({
                    path: 'film',
                    select: 'title'
                })
        ])
            .then(([reviewer, reviews]) => {
                check404(reviewer, id);
                delete reviewer.hash;
                delete reviewer.email;
                delete reviewer.roles;
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
            .catch(next);   
    })

    .put('/:id', ensureAdmin, (req, res, next) => {
        const { id } = req.params;

        Reviewer.findByIdAndUpdate(id, req.body, updateOptions)
            .then(reviewer => {
                delete reviewer.hash;
                delete reviewer.roles;
                res.json(reviewer);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find(req.query)
            .lean()
            .select('name company')
            .then(reviewers => res.json(reviewers))
            .catch(next);
    });