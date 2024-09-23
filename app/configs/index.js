'use strict';

require('dotenv').config();

let env = process.env.NODE_ENV || 'development';
let port = process.env.PORT || 3000;

console.log('****Working environment : ', env);

if (env === 'development') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_DEVELOPMENT;
} else if (env === 'test') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
} else if (env === 'production') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_PRODUCTION;
} else {
    throw new Error('Unknown environment: ' + env);
}

// Optional: Log the selected MongoDB URI
console.log('Using MongoDB URI:', process.env.MONGODB_URI);
