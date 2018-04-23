const { assert } = require('chai');
const { Types } = require('mongoose');
const Film = require('../../lib/models/Film');
const { getErrors } = require('./helpers');

describe('Film model', () => {

    it('valid good model', () => {
        const data = {
            title: 'Brad Pitt movie',
            studio: Types.ObjectId(),
            released: 2000,
            cast: [{
                part: 'Cool guy',
                actor: Types.ObjectId(),
            }]
        };

        const film = new Film(data);
        data._id = (film._id);
        data.cast[0]._id = film.cast[0]._id;
        assert.deepEqual(film.toJSON(), data);
        assert.isUndefined(film.validateSync());
    });

    it('required fields', () => {
        const film = new Film({});
        const errors = getErrors(film.validateSync(), 1);
        assert.equal(errors.title.kind, 'required');
    });
});