const { assert } = require('chai');
const { Types } = require('mongoose');
const Actor = require('../../lib/models/Actor');
const { getErrors } = require('./helpers');

describe('Actor Model', () => {
    it('valid good model', () => {
        const data = {
            name: 'Brad Pitt',
            dob: new Date('1963-12-18'),
            pob: 'Shawnee, OK'
        };

        const actor = new Actor(data);

        data._id = actor._id;

        assert.deepEqual(actor.toJSON(), data);

        assert.isUndefined(actor.validateSync());
    });

    it('required fields', () => {
        const actor = new Actor({});
        const errors = getErrors(actor.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.pob.kind, 'required');
    });
});