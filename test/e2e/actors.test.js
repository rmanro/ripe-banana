const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const checkOk = res => {
    if(!res.ok) throw res.error;
    return res;
};

describe('actors API', () => {

    before(() => dropCollection('actors'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('films'));

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

    let studio1 = {
        name: 'Miramax',
        address: {
            city: 'Hollywood',
            state: 'CA',
            country: 'USA'
        }
    };

    let film1 = {
        title: 'Brad Pitt movie',
        studio: {},
        released: 2000,
        cast: [{
            part: 'Cool guy',
            actor: {}
        }]
    }; 

    before(() => {
        return request.post('/studios')
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
            });
    });

    before(() => {
        return request.post('/actors')
            .send(bradPitt)
            .then(({ body }) => {
                bradPitt = body;
            });
    });

    before(() => {
        film1.studio._id = studio1._id;
        film1.studio.name = studio1.name;
        film1.cast[0].actor._id = bradPitt._id;
        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                film1 = body;
            });
    });


   

   

    
    it('Saves Mila', () => {
        return request.post('/actors')
            .send(milaKunis)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, { _id, __v, ...milaKunis });
                milaKunis = body;
            });
    });

    it('updates an actor', () => {
        bradPitt.pob = 'Shawnee, OK';

        return request.put(`/actors/${bradPitt._id}`)
            .send(bradPitt)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, bradPitt);
            });
    });

    const getFields = ({ _id, name }) => ({ _id, name });

    it('GET - all actors', () => {
        return request.get('/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [bradPitt, milaKunis].map(getFields));
            });

    });

    it('GET - actor by ID', () => {
        return request.get(`/actors/${bradPitt._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { 
                    _id: bradPitt._id, 
                    __v: 0, 
                    name: bradPitt.name, 
                    dob: bradPitt.dob, 
                    pob: bradPitt.pob,
                    films: [{
                        _id: film1._id,
                        title: film1.title,
                        released: film1.released
                    }]
                });
            });
    });
});