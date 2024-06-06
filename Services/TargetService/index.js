const express = require('express');
const Target = require('./models/target');
const paginate = require('./helpers/paginatedResponse');
const repo = require('./repo/targetRepo');
const PayLoadCreator = require('./repo/payloadCreator');
const pub = require('./publisher');
const sub = require('./subscriber');
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
const logger = require('morgan');
const http = require('http');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(metricsMiddleware);

app.get('/targets', async (req, res, next) => {
    const options = {};
    if (req.query.userId) options.userId = req.query.userId;

    const result = Target.find(options).byPage(req.query.page, req.query.perPage);

    const count = await Target.find(options).count();

    result.then(data => res.json(paginate(data, count, req)))
        .catch(next);
});

app.get('/targets/:id', (req, res, next) => {
    const result = Target.findById(req.params.id);

    result.then(data => res.json(data))
        .catch(next);
});

app.post('/targets', async (req, res, next) => {
    let orgValue = req.body;
    let result;

    if (!orgValue.image) {
        return res.status(422).json({message: 'Image cannot be null'});
    }

    try {
        result = await repo.create(orgValue);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }

    try {
        const payloadCreator = new PayLoadCreator('create', result._id, orgValue.image);
        let value = payloadCreator.getPayload();
        pub(value, 'image');
    } catch (err) {
        pub({from: 'target-service_index', error: err}, 'report');
    }
});

app.delete('/targets/:id', async (req, res, next) => {
    try {
        const target = await Target.findById(req.params.id);

        if (target.userId !== req.body.userId) {
            return res.status(422).json({message: 'Can\'t delete target, it\'s not yours.'});
        }

        const payloadCreator = new PayLoadCreator('delete', target._id, target.imageId);
        let value = payloadCreator.getPayload();
        pub(value, 'image');

        const payloadCreator2 = new PayLoadCreator('deleteMany', target._id, '');
        let value2 = payloadCreator2.getPayload();
        pub(value2, 'attempt');

        let result = await repo.delete(target._id);
        res.status(201);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    pub({from: 'target-service_index', error: err}, 'report');

    res.status(err.status || 500);
    res.json(err);
});

if (process.env.NODE_ENV !== 'test') {
    app.set('port', process.env.APP_PORT || 3000);

    const server = http.createServer(app);
    const port = process.env.APP_PORT || 3000;

    server.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
