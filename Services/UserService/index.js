const express = require('express');
const User = require('./models/user');
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

app.get('/users', async (req, res, next) => {
    const result = User.find().byPage(req.query.page, req.query.perPage);

    const count = await User.count();

    result.then(data => res.json(paginate(data, count, req)))
        .catch(next);
});

app.get('/users/:id', (req, res, next) => {
    const result = validId(req.params.id) ? User.findById(req.params.id) : User.findBySlug(req.params.id);

    result.then(data => res.json(data))
        .catch(next);
});

app.get('/username/:userName', (req, res, next) => {
    const result = User.findOne({userName: req.params.userName});

    result.then(data => res.json(data))
        .catch(next);
});

// error handler
app.use(function(err, req, res) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // Render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  if (process.env.NODE_ENV !== 'test') {
    app.set('port', process.env.APP_PORT || 3000);

    const server = http.createServer(app);
    const port = process.env.APP_PORT || 3000;

    server.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;