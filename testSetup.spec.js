'use strict';

const sinon = require('sinon');

before(function() {
  const chai = require('chai');
  const sinonChai = require('sinon-chai');

  global.expect = chai.expect;

  chai.use(sinonChai);

  sinon.stub.returnsWithResolve = data => this.returns(Promise.resolve(data));
  sinon.stub.returnsWithReject = error => this.returns(Promise.reject(error));
});


beforeEach(function() {
  this.sandbox = sinon.sandbox.create();
});


afterEach(function() {
  this.sandbox.restore();
});
