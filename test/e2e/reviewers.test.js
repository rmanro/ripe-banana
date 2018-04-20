const { assert } = require('chai');
const request = require('./request');
const Reviewer = require('../../lib/models/Reviewer');
const { dropCollection } = require('./db');

describe('Reviewer e2e', () => {

    before(() => dropCollection('reviewers'));

    let donald = {
        name: 'Angry Donald',
        company: 'angrydonald.com'
    };

    let rob = {
        name: 'Angry Robert',
        company: 'angryrob.com'
    };

    it('saves a reviewer', () => {
        return request.post('/reviewers')
            .send(donald)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, { _id, __v, ...donald }),
                donald = body;
            });
    });
    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    it('gets reviewer by id', () => {
        return Reviewer.create(rob).then(roundTrip)
            .then(saved => {
                rob = saved;
                return request.get(`/reviewers/${rob._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, rob);
            });
    });

    it('updates a reviewer', () => {
        rob.company = 'angryrobert.com';
        return request.put(`/reviewers/${rob._id}`)
            .send(rob)
            .then(({ body }) => {
                assert.deepEqual(body, rob);
                return Reviewer.findById(rob._id).then(roundTrip);
            })
            .then(updated => {
                assert.deepEqual(updated, rob);
            });
    });

    const getFields = ({ _id, name, company }) => ({ _id, name, company });

    it('gets all reviewers', () => {
        return request.get('/reviewers')
            .then(({ body }) => {
                assert.deepEqual(body, [donald, rob].map(getFields));
            });
    });

});