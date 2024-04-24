require('dotenv').config();
require('./services/clockservice');

const prometheus = require('prom-client');
const emailRouter = require('./routes/email');
const metricsRouter = require('./routes/metrics');
const photosRouter = require('./routes/photos');
const targetsRouter = require('./routes/targets');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
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

// Prometheus Metrics Setup
const registry = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register: registry });
const httpRequestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status'],
  registers: [registry],
});

// Middleware for Prometheus Metrics
app.use((req, res, next) => {
  httpRequestCounter.labels(req.method, res.statusCode).inc();
  next();
});

//require('./vendors/mongoose');
require('./vendors/passportJWT');

// View engine setup Assignment zegt dat dit niet hoeft: "Bij dit vak hoef je geen GUIs te maken in plaats daarvan gebruiken we Postman."
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.set('view engine', 'json');
app.use(metricsMiddleware);

const jwtToken = passport.authenticate('jwt', { session: false });

// Mount route handlers
app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/targets', targetsRouter);
app.use('/metrics', metricsRouter); // Mount the metrics router at the '/metrics' path
app.use('/uploads', express.static('uploads'));  // serve the 'uploads' directory as static files
app.use('/photos', photosRouter);
app.use('/email', emailRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error('Error in request:', err.message);
  console.error('Request URL:', req.originalUrl);

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;