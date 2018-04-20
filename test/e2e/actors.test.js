const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('actors API', () => {

    before(() => dropCollection('actors'));

    let bradPitt = {
        name: 'Brad Pitt',
        dob: '1963-12-18',
        pob: 'Shawnee, OK'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves an actor', () => {
        return request.post('/actors')
            .send(bradPitt)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, { _id, __v, ...bradPitt });
                bradPitt = body;
            });
    });
});