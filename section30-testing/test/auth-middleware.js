const expect= require('chai').expect;
const authMiddleware = require('../middleware/is-auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

describe('Auth middleware', function() {
  it('should throw an error if no auth header is present', function() {
    // call middleware manually
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    // we're not calling it ourselves here
    // we're instead passing a prepared reference to our function
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
  });
  
  it('should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function(headerName) {
        return 'xyz';
      }
    };
      expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer jdjfsl';
      }
    };
    /**
     * stub: a powerful way of replacing some external methods and still restore everything onece you've done
     * so that our test that might need the original functionality still work correctly.
     */
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });
    // jwt.verify = function() { // globaly replace the verify() here(not ideal)
    //   return { userId: 'abc' };
    // }
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore(); // store the originial function
  });

  it('should throw an error if the token cannot be verified', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

})
