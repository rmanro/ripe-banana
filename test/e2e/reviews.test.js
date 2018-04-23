const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const Review = require('../../lib/models/Review');
const { dropCollection } = require('./db');

describe('Review e2e', () => {

    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));

    let donald = {
        name: 'Angry Donald',
        company: 'angrydonald.com'
    };

    before(() => {
        return request.post('/reviewers')
            .send(donald)
            .then(({ body }) => {
                donald = body;
            });
    });

    let review1 = {
        rating: 4,
        reviewer: null,
        review: 'This movie is pretty good'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a review', () => {
        review1.reviewer = donald._id;

        return request.post('/reviews')
            .send(review1)
            .then(({ body }) => {
                const { _id, __v, createdAt, updatedAt } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(createdAt);
                assert.ok(updatedAt);
                assert.deepEqual(body, { _id, __v, createdAt, updatedAt, ...review1 });
                review1 = body;
            });
    });

    it('gets a review', () => {
        return request.get(`/reviews/${review1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    ...review1,
                    reviewer: {
                        _id: donald._id,
                        name: donald.name
                    }
                }]);
            });
    });

    const getFields = ({ _id, rating, review }) => ({ _id, rating, review });

    it('gets all reviews, only id, rating, review, film', () => {
        return request.get('/reviews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [review1].map(getFields));
            });
    });

});