const router = require('express').Router();
const Actor = require('../models/Actor');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (pirate, id) => {
    if(!pirate) {
        throw {
            status: 404,
            error: `Pirate id ${id} does not exist`
        };
    }
};

module.exports = router 
    .post('/', (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    });