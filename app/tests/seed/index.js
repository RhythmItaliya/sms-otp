'use strict'
require('dotenv').config();
const { ObjectID } = require('mongodb');
const { SMS } = require('../../models/sms');

// creae ids for the sms
const smsId = new ObjectID();

// the dummy data array 
const dummySMS = [
    {
        _id: smsId,
        recepientName: process.env.TEST_RECIPIENT_NAME,
        to: process.env.TEST_PHONE,
        from: process.env.TWILIO_PHONE,
        otp: 123432,
        body: 'This is your OTP : 213435',
        _sentAt: new Date().getTime(),
        status: 200
    }
]

// the function to populate the data 
const populateSMS = (done) => {
    SMS.deleteMany({}).then(() => {
        return SMS.insertMany(dummySMS);
    }).then(() => {
        done();
    })
};

module.exports = {
    dummySMS,
    populateSMS
};