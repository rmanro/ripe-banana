const express = require('express');
const morgan = require('morgan');
const app = express();
const errorHandler = require('./util/error-handler');
const createEnsureAuth = require('./util/ensure-auth');
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

const ensureAuth = createEnsureAuth();
const ensureAdmin = createEnsureAdmin();
const ensureSameUser = createEnsureSameUser();

app.use('/auth', auth);
app.use('/studios', studios);
app.use('/actors', actors);
app.use('/reviewers', reviewers);
app.post('/reviews', ensureSameUser, reviews);
app.use('/reviews', reviews);
app.use('/films', films);



app.use(errorHandler());

module.exports = app;