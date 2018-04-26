const express = require('express');
const morgan = require('morgan');
const app = express();
const errorHandler = require('./util/error-handler');
const createEnsureAdmin = require('./util/ensure-admin');
const createEnsureSameUser = require('./util/ensure-sameUser');
require('./models/register-plugins');

app.use(morgan('dev'));
app.use(express.json());

const auth = require('./routes/auth');
const studios = require('./routes/studios');
const actors = require('./routes/actors');
const reviewers = require('./routes/reviewers');
const reviews = require('./routes/reviews');
const films = require('./routes/films');

const ensureAdmin = createEnsureAdmin();
const ensureSameUser = createEnsureSameUser();

app.use('/auth', auth);
// app.use('/studios/:id', ensureAdmin, studios);
app.use('/studios', studios);
app.post('/actors', ensureAdmin, actors);
app.put('/actors', ensureAdmin, actors);
app.delete('/actors', ensureAdmin, actors);
app.use('/actors', actors);
app.post('/reviewers', ensureAdmin, reviewers);
app.put('/reviewers', ensureAdmin, reviewers);
app.delete('/reviewers', ensureAdmin, reviewers);
app.use('/reviewers', reviewers);
app.post('/reviews', ensureSameUser, reviews);
app.put('/reviews', ensureSameUser, reviews);
app.delete('/reviews', ensureSameUser, reviews);
app.use('/reviews', reviews);
app.post('/films', ensureAdmin, films);
app.put('/films', ensureAdmin, films);
app.delete('/films', ensureAdmin, films);
app.use('/films', films);



app.use(errorHandler());

module.exports = app;