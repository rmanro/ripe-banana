const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Auth API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token = null;

    beforeEach(() => {
        return request 
            .post('/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'abc',
                name: 'Roger Ebert',
                company: 'Chicago Sun-Times'
            })
            .then(({ body }) => token = body.token);
    });

    it('Signup', () => {
        assert.ok(token);
    });

    it('Signin', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });

    });
});