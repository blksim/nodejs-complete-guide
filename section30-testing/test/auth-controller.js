const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

/**
 * we have describe() and it() and it() are our test cases describe() allowws us to group them 
 * instead of describe().
 * We have certain extra functions we can call that actually will run before all tests or before each tests at the same for after() and afterEach()
 */
describe('Auth Controller - Login', function () {
  before(function (done) {
      mongoose
        .connect('mongodb+srv://testuser:DeIHBgxdMlns0QEv@cluster0.yqyyj.mongodb.net/test-messages')
        .then(result => {
          const user = new User({
            email: 'test@test.com',
            password: 'tester',
            name: 'test',
            posts: [],
            _id: '5f4085bffc68757544197b98'
          });
          return user.save();
        })
        .then(() => {
          done();
        });

    beforeEach(function() {
     // reset before some testcase
    });

    afterEach(function() {
      //after every testcase
    })
    
    it('should throw an error if accessing the database fails', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
          body: {
            email: 'test@test.com',
            password: 'tester'
          }
        };

        AuthController.login(req, {}, () => {})
          .then(result => {
            expect(result).to.be.an('error'); 
            expect(reuslt).to.have.property('statusCode', 401); 
            done(); // signal mocha to wait to execute
          });

      User.findOne.restore();
    });

    it('should send a response with avalid user status for an existing user', function (done) {
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.userStatus = data.status;
        }
      };
      AuthController.getUserStatus(req, res, () => {}).then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('i am new!');
        done();
      });
    })
    .catch(err => console.log(err));
  }); 
  after(function (done) {
    User.deleteMany({}).then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
  });
});