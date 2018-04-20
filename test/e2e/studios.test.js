const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Studio API', () => {

    before(() => dropCollection('studios'));

    let studio1 = {
        name: 'Miramax',
        address: {
            city: 'Hollywood',
            state: 'CA',
            country: 'USA'
        }
    };

    let studio2 = {
        name: 'Werner Herzog Filmproduktion',
        address: {
            city: 'Munich',
            state: 'Bavaria',
            country: 'Germany'
        }
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('POST - saves a studio', () => {
        return request.post('/studios')
            .send(studio1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, { ...studio1, _id, __v });
                studio1 = body;
            });
    });

    it('GET - all studios', () => {
        return request.post('/studios')
            .send(studio2)
            .then(checkOk)
            .then(({ body }) => {
                studio2 = body;
            })
            .then(() => {
                return request.get('/studios')
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.deepEqual(body, [studio1, studio2]);
                    });

            });
    });
});