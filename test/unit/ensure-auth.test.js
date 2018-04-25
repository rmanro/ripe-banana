const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');

describe('Ensure Auth Middleware', () => {

    const user = { _id: 123 };
    let token = '';
    beforeEach(() => token = tokenService.sign(user));

    const ensureAuth = createEnsureAuth();

    it('Adds Payload as req.user on Success', done => {
        
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };

        const next = () => {
            assert.equal(req.user.id, user._id);
            done();
        };

        ensureAuth(req, null, next);
    });

    it('Calls Next With Error When Token Is Bad', done => {
        
        const req = {
            get() { return 'bad-token'; }
        };

        const next = err => {
            assert.equal(err.status, 401);
            done();
        };

        ensureAuth(req, null, next);

    });
});