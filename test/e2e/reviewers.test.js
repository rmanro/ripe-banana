const { assert } = require('chai');
const request = require('./request');
const Reviewer = require('../../lib/models/Reviewer');
const { dropCollection, createToken } = require('./db');
const { verify } = require('../../lib/util/token-service');


describe('Reviewer e2e', () => {

    before(() => dropCollection('actors'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('films'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));

    let token = '';
    let token2 = '';
    before(() => createToken(reviewer1)
        .then(t => {
            token = t;
            reviewer1._id = verify(token).id;
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

    let reviewer1 = {
        name: 'IGN',
        company: 'IGN',
        email: 'ign@ign.com',
        password: 'ign',
        roles: ['admin']
    };

    let reviewer2 = {
        name: 'Roger',
        company: 'IGN',
        email: 'roger@ign.com',
        password: 'ign'
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

    let review1 = {
        rating: 4,
        reviewer: {},
        review: 'sweet film',
        film: {}
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
            .set('Authorization', token)
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
            });
    });

    before(() => {
        return request.post('/actors')
            .set('Authorization', token)
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
            });
    });

    before(() => {
        film1.studio._id = studio1._id;
        film1.studio.name = studio1.name;
        film1.cast[0].actor._id = actor1._id;
        return request.post('/films')
            .set('Authorization', token)
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                film1 = body;
            });
    });



    before(() => {
        review1.reviewer = reviewer1._id;
        review1.film = film1._id;

        return request.post('/reviews')
            .set('Authorization', token)
            .send(review1)
            .then(({ body }) => {
                review1 = body;
            });
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    it('gets reviewer by id and returns reviews', () => {
        return request.get(`/reviewers/${reviewer1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: reviewer1._id,
                    __v: 0,
                    name: reviewer1.name,
                    company: reviewer1.company,
                    reviews: [{
                        _id: review1._id,
                        rating: review1.rating,
                        review: review1.review,
                        film: {
                            _id: film1._id,
                            title: film1.title
                        }
                    }]
                });
            });


    });

    it('Updates a Reviewer', () => {
        reviewer1.company = 'IGNN';
        return request.put(`/reviewers/${reviewer1._id}`)
            .set('Authorization', token)
            .send(reviewer1)
            .then(({ body }) => {
                assert.equal(body._id, reviewer1._id);
                assert.equal(body.company, 'IGNN');
                return Reviewer.findById(reviewer1._id).then(roundTrip);
            })
            .then(updated => {
                assert.equal(updated.company, 'IGNN');
            });
    });

    const getFields = ({ _id, name, company }) => ({ _id, name, company });

    it('gets all reviewers', () => {
        return request.get('/reviewers')
            .then(({ body }) => {
                assert.deepEqual(body, [reviewer1, reviewer2].map(getFields));
            });
    });

    it('Attempts an Update a Reviewer with bad token', () => {
        reviewer1.company = 'IGNNN';
        return request.put(`/reviewers/${reviewer1._id}`)
            .set('Authorization', 'bad token')
            .send(reviewer1)
            .then(({ body }) => {
                assert.equal(body.error, 'Invalid Token');
            });
    });

    it('Attempts an Update a Reviewer with unauthorized user', () => {
        return request.put(`/reviewers/${reviewer2._id}`)
            .set('Authorization', token2)
            .send(reviewer1)
            .then(({ body }) => {
                assert.equal(body.error, 'Not Authorized');
            });
    });

});