const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');

describe('The API endpoint', () => {

    describe('/echo', () => {
        it('should return the same string', (done) => {
            request(app)
                .get('/api/echo?string=helloworld')
                .end((err, res) => {
                    expect(res.text).to.equal('helloworld');
                    done();
                });
        });
    });

    describe('/getPrice', () => {
        it('should return the correct JSON response', (done) => {
            request(app)
                .post('/api/getPrice')
                .send({ itemId: '73eebcb6-a5d8-46ff-8a5e-0b9e79be1489', quantity: 2 })
                .end((err, res) => {
                    expect(res.body.itemId).to.equal('73eebcb6-a5d8-46ff-8a5e-0b9e79be1489');
                    expect(res.body.quantity).to.equal(2);
                    expect(res.body.perItemPrice).to.equal(250);
                    expect(res.body.totalPricePreTax).to.equal(500);
                    expect(res.body.taxRate).to.equal(0.2);
                    expect(res.body.totalPriceWithTax).to.equal(600);
                    done();
                });
        });
    });

    describe('/compute', () => {
        it('should return the correct hash', (done) => {
            request(app)
                .post('/api/compute')
                .send([9, 58, 79, 99, 33, 67, 68, 48, 26, 42, 11,
                    37, 49, 35, 28, 55, 19, 72, 61, 1, 19, 31, 92, 84, 21,
                    99, 25, 29, 42, 61, 64, 84, 99, 40, 85, 39, 11, 13, 29, 49,
                    95, 29, 30, 21, 12, 52, 98, 51, 18, 76, 5, 54, 16, 28, 83,
                    59, 59, 36, 63, 22, 63, 15, 41, 24, 84, 62, 86, 23, 95, 63,
                    99, 46, 40, 57, 97, 6, 82, 96, 88, 66, 60, 99, 92, 75, 58,
                    32, 15, 32, 72, 61, 52, 50, 61, 81, 65, 46, 40, 71, 32, 71])
                .end((err, res) => {
                    expect(res.text).to.equal('f79f064b519bfb1197b5c0f2e0c03c54e52fada9b850d681f7dd305f047ea1bb');
                    done();
                });
        });
    });

    describe('/parse', () => {
        it('should return the index of the searchString', (done) => {

            const strings = [];
            for(let i = 0; i < 100; i++) {
                strings.push(require('crypto').randomBytes(20).toString('hex'));
            }

            const randomIndex = Math.floor(Math.random() * 100);
            const searchString = strings[randomIndex];

            request(app)
                .post('/api/parse?searchString=' + searchString)
                .send(strings)
                .end((err, res) => {
                    expect(res.text).to.equal(randomIndex.toString());
                    done();
                });
        });
    });

    describe('/query', () => {
        it('should return the number of needed queries for the round-trip', (done) => {
            request(app)
                .get('/api/query?initialPrimaryKey=038aca33-a8c0-4b5d-8543-cc50b8f4895c')
                .end((err, res) => {
                    expect(res.text).to.equal("200");
                    done();
                });
        });
    });
});