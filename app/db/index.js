'use strict';

// Require mongoose
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to the database');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

module.exports = { mongoose };
