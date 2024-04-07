const express = require('express');
const Target = require('./models/target');
const http = require('http');
const paginate = require('./helpers/paginatedResponse');
const validId = require('./helpers/validId');
const logger = require('morgan');
const promBundle = require('express-prom-bundle');

const metricsMiddleware = promBundle({
    includePath: true,
    includeStatusCode: true,
    normalizePath: true,
    promClient: {
        collectDefaultMetrics: {},
    },
});

const app = express();

require('./database');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(metricsMiddleware);

app.get('/targets', async (req, res, next) => {
    const result = Target.find().byPage(req.query.page, req.query.perPage);

    const count = await Target.count();

    result.then(data => res.json(paginate(data, count, req)))
        .catch(next);
});

app.get('/targets/:id', (req, res, next) => {
    const result = validId(req.params.id) ? Target.findById(req.params.id) : Target.findBySlug(req.params.id);

    result.then(data => res.json(data))
        .catch(next);
});

app.use(function(err, req, res) {
    const message = err.message;
    const error = req.app.get('env') === 'development' ? err : {};
  
    res.status(err.status || 500);
    res.send(message);
});

module.exports = app;