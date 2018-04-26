const { assert } = require('chai');
const request = require('./request');
const Reviewer = require('../../lib/models/Reviewer');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');


describe('Reviewer e2e', () => {

    before(() => dropCollection('reviewers'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));
    before(() => dropCollection('films'));

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    let donald = {
        name: 'Angry Donald',
        company: 'angrydonald.com',
        email: 'donald@angrydonald.com',
        password: 'donald'
    };

    let jeff = {
        name: 'Angry Jeff',
        company: 'angryjeff.com',
        email: 'jeff@angryjeff.com',
        password: 'jeff'
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
        return request.post('/auth/signup')
            .send(jeff)
            .then(({ body }) => {
                jeff._id = verify(body.token).id;
            });
    });

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
        film1.studio._id = studio1._id;
        film1.studio.name = studio1.name;
        film1.cast[0].actor._id = actor1._id;
        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                film1 = body;
            });
    });



    before(() => {
        review1.reviewer = jeff._id;
        review1.film = film1._id;

        return request.post('/reviews')
            .send(review1)
            .then(({ body }) => {
                review1 = body;
            });
    });

    it('signs up a reviewer', () => {
        return request.post('/auth/signup')
            .send(donald)
            .then(({ body }) => {
                assert.ok(body.token);
                donald._id = verify(body.token).id;
            });
    });
    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    it('gets reviewer by id and returns reviews', () => {
        return request.get(`/reviewers/${jeff._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: jeff._id,
                    __v: 0,
                    name: jeff.name,
                    company: jeff.company,
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

    it('updates a reviewer', () => {
        jeff.company = 'angrierjeff.com';
        return request.put(`/reviewers/${jeff._id}`)
            .send(jeff)
            .then(({ body }) => {
                assert.equal(body._id, jeff._id);
                assert.equal(body.company, 'angrierjeff.com');
                return Reviewer.findById(jeff._id).then(roundTrip);
            })
            .then(updated => {
                assert.equal(updated.company, 'angrierjeff.com');
            });
    });

    const getFields = ({ _id, name, company }) => ({ _id, name, company });

    it('gets all reviewers', () => {
        return request.get('/reviewers')
            .then(({ body }) => {
                assert.deepEqual(body, [jeff, donald].map(getFields));
            });
    });

});