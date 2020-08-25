const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

/**
 * we have describe() and it() and it() are our test cases describe() allowws us to group them 
 * instead of describe().
 * We have certain extra functions we can call that actually will run before all tests or before each tests at the same for after() and afterEach()
 */
describe('Feed Controller - Login', function () {
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
    });
    
    beforeEach(function() {
     // reset before some testcase
    });

    afterEach(function() {
      //after every testcase
    })
    
    it('should add a created post to the posts of the creator', function (done) {
        const req = {
          body: {
            title: 'Test Post',
            content: 'content'
          },
          file: {
            path: 'abc'
          },
          userId: '5f4085bffc68757544197b98'
        };

        const res = { status: function() {}, json: function() {}};
        FeedController.createPost(req, res, () => {})
        .then((savedUser) => {
          expect(savedUser).to.have.property('posts');
          expect(savedUser.posts).to.have.length(1);
          done();
        });
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