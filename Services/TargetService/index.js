const express = require('express');
const mongoose = require('mongoose');
const Target = mongoose.models.Target || require('./models/target');
const http = require('http');
const logger = require('morgan');
const promBundle = require('express-prom-bundle');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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

app.post('/targets', upload.single('photo'), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const target = new Target({
        ...req.body,
        photo: req.file.path, // Add the path of the uploaded file
    });
    target.save()
        .then(data => res.status(201).json(data))
        .catch(next);
});

if (process.env.NODE_ENV !== 'test') {
    app.set('port', process.env.APP_PORT || 3000);

    const server = http.createServer(app);
    const port = process.env.APP_PORT || 3000;

    server.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;