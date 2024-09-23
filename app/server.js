'use strict';

const configs = require('./configs');
let port = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');

const app = express();

// Middlewares here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/_public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Custom modules
const mongoose = require('./db');
const publicRoutes = require('./routes/public')(app);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// err
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log('App started and listening to port', port);
    });
}

module.exports = app;
