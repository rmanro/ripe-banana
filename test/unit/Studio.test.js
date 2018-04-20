const { assert } = require('chai');
const Studio = require('../../lib/models/Studio');
const { getErrors } = require('./helpers');

describe('Studio Model', () => {

    it('Valid Model', () => {
        
        const data = {
            name: 'Hollywood Studios',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        };

        const studio = new Studio(data);
        data._id = studio._id;
        assert.deepEqual(studio.toJSON(), data);
        assert.isUndefined(studio.validateSync());
    });

    it('Required Fields', () => {
        const studio = new Studio({});
        const errors = getErrors(studio.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });
    
});