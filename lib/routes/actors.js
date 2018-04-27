const router = require('express').Router();
const Actor = require('../models/Actor');
const { updateOptions } = require('../util/mongoose-helpers');
const Film = require('../models/Film');
const createEnsureAdmin = require('../util/ensure-admin');
const ensureAdmin = createEnsureAdmin();

const check404 = (actor, id) => {
    if(!actor) {
        throw {
            status: 404,
            error: `Actor id ${id} does not exist`
        };
    }
};

module.exports = router 
    .post('/', ensureAdmin, (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .put('/:id', ensureAdmin, (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Actor.find(req.query)
            .lean()
            .select('name')
            .then(actors => res.json(actors))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params; 
        Promise.all([
            Actor.findById(id)
                .lean(),

            Film.find({ 'cast.actor': id })
                .select('title released')
                .lean()
        ])
            .then(([actor, films]) => {
                check404(actor, id);
                actor.films = films;
                res.json(actor);
            })
            .catch(next);
    })
    
    .delete('/:id', ensureAdmin, (req, res, next) => {
        const { id } = req.params;
        return Film.find({ 'cast.actor': id })
            .then((result) => {
                if(result.length > 0) {
                    res.json({ removed: false });
                } else {
                    return Actor.findByIdAndRemove(id)
                        .then(removed => res.json({ removed }));
                }
            })
            .catch(next);
    });