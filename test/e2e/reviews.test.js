const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');
const { verify } = require('../../lib/util/token-service');


describe('Review e2e', () => {

    before(() => dropCollection('films'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));
    

    let token1 = '';
    let token2 = '';
    before(() => createToken(reviewer1)
        .then(t => {
            token1 = t;
            reviewer1._id = verify(token1).id;
        }));

    before(() => createToken(reviewer2)
        .then(t => {
            token2 = t;
            reviewer2._id = verify(token2).id;
        }));

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


    before(() => {
        return request.post('/studios')
            .set('Authorization', token1)
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
            });
    });

    before(() => {
        return request.post('/actors')
            .set('Authorization', token1)
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
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

    let reviewer1 = {
        name: 'IGN',
        company: 'IGN',
        email: 'ign@ign.com',
        password: 'ign',
        roles: ['admin']
    };

    let reviewer2 = {
        name: 'Bob',
        company: 'IGN',
        email: 'bob@ign.com',
        password: 'ign'
    };

    before(() => {
        film1.studio._id = studio1._id;
        film1.studio.name = studio1.name;
        film1.cast[0].actor._id = actor1._id;
        return request.post('/films')
            .set('Authorization', token1)
            .send(film1)
            .then(({ body }) => {
                film1 = body;
            });
    });

    let review1 = {
        rating: 4,
        reviewer: null,
        review: 'This movie is pretty good',
        film: null
    };

    let review2 = {
        rating: 1,
        reviewer: null,
        review: 'This movie is pretty bad',
        film: null
    };


    it('saves a review - needs to be same user', () => {
        review1.reviewer = reviewer1._id;
        review1.film = film1._id;

        return request.post('/reviews')
            .set('Authorization', token1)
            .send(review1)
            .then(({ body }) => {
                const { _id, __v, film, createdAt, updatedAt } = body;
                assert.ok(_id);
                assert.ok(film);
                assert.equal(__v, 0);
                assert.ok(createdAt);
                assert.ok(updatedAt);
                assert.deepEqual(body, { _id, __v, film, createdAt, updatedAt, ...review1 });
                review1 = body;
            });
    });

    it('Another user tries to save a review by someone else - not authorized', () => {
        review2.reviewer = reviewer2._id;
        review1.film = film1._id;

        return request.post('/reviews')
            .set('Authorization', token2)
            .send(review1)
            .then(({ body }) => {
                assert.equal(body.error, 'Not Authorized');
            });
    });

    it('gets a review', () => {
        return request.get(`/reviews/${review1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    ...review1,
                    reviewer: {
                        _id: reviewer1._id,
                        name: reviewer1.name
                    }
                }]);
            });
    });

    const getFields = ({ _id, rating, review }) => {
        return { 
            _id, rating, review, 
            film : { _id: film1._id, title: film1.title }
        };
    };

    it('gets all reviews, only id, rating, review, film', () => {
        return request.get('/reviews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [review1].map(getFields));
            });
    });

});