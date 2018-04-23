const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('actors API', () => {

    before(() => dropCollection('actors'));

    let bradPitt = {
        name: 'Brad Pitt',
        dob: '1963-12-18',
        pob: 'Shawnee, OK, USA'
    };
    
    let milaKunis = {
        name: 'Mila Kunis',
        dob: '1983-8-14',
        pob: 'Chernivtsi, Ukraine'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    const saveActor = (actorName) => {
        it('saves an actor', () => {
            return request.post('/actors')
                .send(actorName)
                .then(checkOk)
                .then(({ body }) => {
                    const { _id, __v } = body;
                    assert.ok(_id);
                    assert.equal(__v, 0);
                    assert.deepEqual(body, { _id, __v, ...actorName });
                    bradPitt = body;
                });
        });
    };

    saveActor(bradPitt);
    saveActor(milaKunis);

    it('updates an actor', () => {
        bradPitt.pob = 'Shawnee, OK';

        return request.put(`/actors/${bradPitt._id}`)
            .send(bradPitt)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, bradPitt);
            });
    });
});