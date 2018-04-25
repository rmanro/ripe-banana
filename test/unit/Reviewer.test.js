const { assert } = require('chai');
const Reviewer = require('../../lib/models/Reviewer');
const { getErrors } = require('./helpers');

describe.only('Reviewer Model', () => {

    const data = {
        name: 'Roger Ebert',
        company: 'Chicago Sun-Times',
        email: 'roger@ebert.com',
        roles: ['admin']
    };

    const password = 'roger';

    let user = null;
    beforeEach(() => {
        user = new Reviewer(data);
        user.generateHash(password);
    });

    it('Generates Hash From Password', () => {
        user.generateHash(password);
        assert.ok(user.hash);
        assert.notEqual(user.hash, password);
    });

    it('Compares Password to Hash', () => {
        user.generateHash(password);
        assert.isOk(user.comparePassword(password));
    });

    it('Valid good model', () => {
        const user = new Reviewer(data);
        data._id = user._id;
        assert.deepEqual(user.toJSON(), data);
    });

    it('required fields', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 4);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });

});