const { assert } = require('chai');
const { Types } = require('mongoose');
const Review = require('../../lib/models/Review');
const { getErrors } = require('./helpers');

describe('Review Model', () => {

    it('Valid good model', () => {
        const data = {
            rating: 3,
            reviewer: Types.ObjectId(),
            review: 'This movie is ok'
        };

        const review = new Review(data);

        data._id = review._id;
        assert.deepEqual(review.toJSON(), data);

        assert.isUndefined(review.validateSync());
    });

    it('required fields', () => {
        const review = new Review({});
        const errors = getErrors(review.validateSync(), 2);
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.review.kind, 'required');
    });
});