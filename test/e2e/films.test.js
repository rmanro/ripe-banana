const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe('Films API', () => {
    
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));
    before(() => dropCollection('films'));

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    let studio1 = {
        name: 'Miramax',
        address: {
            city: 'Hollywood',
            state: 'CA',
            country: 'USA'
        }
    };

    let actor1 = {
        name: 'Brad Pitt',
        dob: '1963-12-18',
        pob: 'Shawnee, OK'
    };

    let actor2 = {
        name: 'Gael Garcia Bernal',
        dob: '1978-11-30',
        pob: 'Guadalajara, Jalisco, Mexico'
    
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
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
            });
    });

    before(() => {
        return request.post('/actors')
            .send(actor2)
            .then(({ body }) => {
                actor2 = body;
            });
    });

    let film1 = {
        title: 'Brad Pitt movie',
        studio: {},
        released: 2000,
        cast: [{
            part: 'Cool guy',
            actor: {}
        }]
    }; 
    
    let film2 = {
        title: 'Gael movie',
        studio: {},
        released: 2005,
        cast: [{
            part: 'Cooler guy',
            actor: {}
        }]
    }; 

    let reviewer1 = {
        name: 'IGN',
        company: 'IGN'
    };

    let review1 = {
        rating: 4,
        reviewer: {},
        review: 'sweet film'
    };
    
    it('POST - saving a film', () => {
        film1.studio._id = studio1._id;
        film1.studio.name = studio1.name;
        film1.cast[0].actor._id = actor1._id;
        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.equal(body.studio, studio1._id);
                assert.equal(body.cast[0].actor, actor1._id);
                film1 = body;
            });
    });

    const getFields = ({ _id, title, released }) => {
        return { 
            _id, title, released, studio: { _id: studio1._id, name: studio1.name } 
        };
    };
    
    it('GET - all films', () => {
        return request.get('/films')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [film1].map(getFields));
            });
    });

    it('POST - saving a film', () => {
        film2.studio._id = studio1._id;
        film2.studio.name = studio1.name;
        film2.cast[0].actor._id = actor2._id;
        return request.post('/films')
            .send(film2)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.equal(body.studio, studio1._id);
                assert.equal(body.cast[0].actor, actor2._id);
                film2 = body;
            });
    });

    // const getFields2 = ({ _id, title, released }) => {
    //     return { 
    //         _id, title, released, studio: { _id: studio1._id, name: studio1.name } 
    //     };
    // };

    it.skip('get film by id', () => {
        return request.get(`/films/${film1._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    ...film1,
                    // reviews: {
                    //     _id: 
                    // }
                });
            });
    });

    it('deletes a film', () => {
        return request.delete(`/films/${film2._id}`)
            .then(() => {
                return request.get(`/films/${film2._id}`); 
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });


    
});