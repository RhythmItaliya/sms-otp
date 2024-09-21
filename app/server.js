'use strict';

// Load configs at first 
const configs = require('./configs');
let port = process.env.PORT || 3000;

// Import npm and node modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');

// Create the app
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

// Only listen on a port in a local or non-serverless environment
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log('App started and listening to port', port);
    });
}

// Export the app directly for Vercel
module.exports = app;
