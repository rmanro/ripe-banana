const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth API', () => {

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

    it('Gives 400 on Signup of Same Email', () => {
        return request
            .post('/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email Exists');
            });
    });

    it('Gives 401 on Non-Existent Email', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'bad@me.com',
                password: 'abc'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid Email or Password');
            });
    });

    it('Gives 401 on Bad Password', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'abd'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid Email or Password');
            });
    });

    it('Verify Route Verifies Token', () => {
        return request
            .post('/auth/verify')
            .send({ token: token })
            .then(({ body }) => {
                assert.equal(body.status, 200);
                assert.equal(body.message, 'Valid Token');
            });

    });

    // it('Verify Returns 500 if no token', () => {
    //     token = '5';
    //     return request
    //         .post('/auth/verify')
    //         .send({ token: token })
    //         .then((body) => {
    //             console.log(body);
    //             assert.equal(body.status, 401);
    //             assert.equal(body.error, 'Invalid Token');
    //         });
    // }); TODO
});