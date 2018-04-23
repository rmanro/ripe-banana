const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    title: RequiredString,
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio'
    },
    released: Number,
    cast: [{
        part: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor'
        }
    }]
});

module.exports = mongoose.model('Film', schema);