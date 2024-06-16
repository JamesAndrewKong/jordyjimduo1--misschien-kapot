const express = require('express');
const Image = require('./models/image');
const paginate = require('./helpers/paginatedResponse');
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

app.get('/images/:id', (req, res, next) => {
    const result = Image.findById(req.params.id);

    result.then(data => {
        res.json(data);
    }).catch(next);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    pub({from: 'image-service_index', error: err}, 'report');

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
