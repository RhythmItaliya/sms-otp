require('dotenv').config();
const expect = require('expect');
const request = require('supertest');
const { app } = require('./../server');
// the objectID to create new id 
const { ObjectID } = require('mongodb');
// the SMS model 
const { SMS } = require('../models/sms');
// require the dummy data 
const { dummySMS, populateSMS } = require('./seed');

let testnumber = 919265748502
let formattedTestNumber = '+919265748502'
let testRecepientName = process.env.TEST_RECIPIENT_NAME

// seed the db with data 
beforeEach(populateSMS);

// test for the GET / route
describe('GET /', () => {
    it('should redirect to GET /contacts', (done) => {
        request(app)
            .get('/')
            .expect(302)
            .expect('Location', '/contacts')
            .end(done);
    })
});

// the GET /contacts route 
describe('GET /contacts', () => {
    it('should display all the contacts from .json file', (done) => {
        request(app)
            .get('/contacts')
            .expect(200)
            .end(done);
    });
});

// test for bad url
describe('GET /wrong-url', () => {
    it('should redirect to /404  for wrong urls', (done) => {
        request(app)
            .get('/sdsdfsdf') // any randon url 
            .expect(302)
            .expect('Location', '/404')
            .end(done);
    });

    it('should give 404 for GET /404', (done) => {
        request(app)
            .get('/404')
            .expect(404)
            .end(done);
    });
});

// test for the GET /contacts/details/:mobile route
describe('GET /contacts/details:mobile', () => {
    it('should give 200 for valid mobile number', (done) => {
        request(app)
            .get(`/contacts/details/${testnumber}`)
            .expect(200)
            .end(done);
    });

    it('should give a 404 for invalid mobile number', (done) => {
        request(app)
            .get('/contacts/details/21343543635634534')
            .expect(404)
            .end(done);
    })
});

// test for the GET /compose/:mobile route
describe('GET /compose/:mobile', () => {
    it('should give a 200 for valid mobile number', (done) => {
        request(app)
            .get(`/compose/${testnumber}`)
            .expect(200)
            .end(done);
    });

    it('should give a 404 for valid mobile number', (done) => {
        request(app)
            .get('/compose/91')
            .expect(404)
            .end(done);
    });
})


describe('POST /compose', () => {

    it('should save a sms in the database', (done) => {
        // creating a dummy msg to test saving in DB
        let msg = {
            _id: new ObjectID(),
            recepientName: testRecepientName,
            to: testnumber,
            from: process.env.TWILIO_PHONE,
            otp: 123456,
            body: 'Your otp is listed as 123456 in the DB',
            _sentAt: new Date().getTime(),
            status: 200
        };
        let sms = new SMS(msg);

        sms.save().then((smsDB) => {
            expect(smsDB.recepientName).toBe(msg.recepientName);
            expect(smsDB._id.toString()).toBe(msg._id.toString());
            expect(smsDB.to).toBe(msg.to);
            expect(smsDB.otp).toBe(msg.otp);
            expect(smsDB.status).toBe(msg.status);
            done();
        }).catch((err) => done(err));
    });


    it('should give 200 for a verified mobile', function (done) {
        // no arrow funtion because we need to use this inside the block
        this.timeout(15000); // A very long environment setup.
        setTimeout(done, 15000);

        // the message data 
        let sms = {
            mobile: formattedTestNumber,
            otp: dummySMS[0].otp,
            message: dummySMS[0].body
        }

        request(app)
            .post('/compose')
            .send(sms)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                // check if the data is saved in the DB 
                SMS.findOne({ 'to': sms.mobile }).then((smsDB) => {
                    expect(smsDB.to).toBe(parseInt(sms.mobile));
                    expect(smsDB.recepientName).toBe(testRecepientName);
                    expect(smsDB.status).toBe(200);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should give 400 for a unverified mobile', function (done) {
        // no arrow funtion because we need to use this inside the block
        this.timeout(15000); // A very long environment setup.
        setTimeout(done, 15000);

        // the message data 
        let sms = {
            mobile: '+9192657485021',
            otp: dummySMS[0].otp,
            message: dummySMS[0].body
        }

        request(app)
            .post('/compose')
            .send(sms)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('should give a 400 for invalid mobile number', (done) => {
        let sms = {
            mobile: formattedTestNumber,
            otp: dummySMS[0].otp,
            message: dummySMS[0].body
        }

        request(app)
            .post('/compose')
            .send(sms)
            .expect(400)
            .end(() => {
                done();
            });
    })
});

describe('GET /sent/details/:id', () => {
    let id = dummySMS[0]._id;

    it('should give 200 for getting id', (done) => {
        request(app)
            .get(`/sent/details/${id}`)
            .expect(200)
            .end(done);
    });

    it('should give 404 for invalid id', (done) => {
        request(app)
            .get('/sent/details/' + id + 'asad')
            .expect(400)
            .end(done);
    })
})