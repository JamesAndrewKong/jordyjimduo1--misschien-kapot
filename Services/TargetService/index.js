const express = require('express');
const Target = require('./models/target');
const http = require('http');
const paginate = require('./helpers/paginatedResponse');
const validId = require('./helpers/validId');
const logger = require('morgan');
const promBundle = require('express-prom-bundle');
const axios = require('axios'); 

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
require('dotenv').config();

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

app.use(function(err, req, res, next) {
    const message = err.message;
    const error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.send(message);
});

if (process.env.NODE_ENV !== 'test') {
    app.set('port', process.env.APP_PORT || 3000);

    const server = http.createServer(app);
    const port = process.env.APP_PORT || 3000;

    server.listen(port, () => console.log(`Listening on port ${port}`));
}

app.post('/targets', async (req, res, next) => {
    const target = new Target(req.body);
    target.save()
        .then(data => res.status(201).json(data))
        .catch(err => {
            console.error('Error saving target:', err);
            next(err);
        });
});

module.exports = app;