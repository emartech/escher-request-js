'use strict';

const EscherRequest = require('./escherRequest');
const request = require('request');
const Escher = require('escher-auth');

describe('EscherRequest', function() {
  let serviceConfig = {
    host: 'localhost',
    port: 1234,
    prefix: '/api',
    rejectUnauthorized: false,
    secure: true,
    credentialScope: 'eu/dummy/ems_request'
  };

  let createDummyResponse = function() {
    return {
      headers: {},
      body: 'response body dummy'
    };
  };

  let escherRequestOptions;

  beforeEach(function() {
    escherRequestOptions = new EscherRequest.Options(serviceConfig.host, serviceConfig);
  });

  it('should sign headers of GET request', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);

    this.sandbox.stub(request, 'get').callsFake(function(options, callback) {
      expect(options.headers['x-ems-auth']).to.have.string('SignedHeaders=content-type;host;x-ems-date,');
      callback(null, createDummyResponse());
    });

    escherRequest.get('/path');
  });

  it('should sign headers of POST request', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);

    this.sandbox.stub(request, 'post').callsFake(function(options, callback) {
      expect(options.headers['x-ems-auth']).to.have.string('SignedHeaders=content-type;host;x-ems-date,');
      callback(null, createDummyResponse());
    });

    escherRequest.post('/path', { name: 'Almanach' });
  });

  it('should sign headers of DELETE request', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);

    this.sandbox.stub(request, 'delete').callsFake(function(options, callback) {
      expect(options.headers['x-ems-auth']).to.have.string('SignedHeaders=content-type;host;x-ems-date,');
      callback(null, createDummyResponse());
    });

    escherRequest.delete('/path');
  });

  it('should sign headers with non string values', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);
    escherRequestOptions.setHeader(['x-customer-id', 15]);

    this.sandbox.stub(request, 'post').callsFake(function(options, callback) {
      expect(options.headers['x-ems-auth']).to.have.string('content-type;host;x-customer-id;x-ems-date,');
      callback(null, createDummyResponse());
    });

    escherRequest.post('/path', { name: 'Almanach' });
  });

  it('should encode payload when content type is json', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);
    this.sandbox.stub(request, 'post').callsFake(function(options, callback) {
      try {
        expect(options.body).to.eql('{"name":"Almanach"}');
        callback(null, createDummyResponse());
      } catch (e) {
        callback(e, createDummyResponse());
      }
    });

    return escherRequest.post('/path', { name: 'Almanach' });
  });

  it('should encode payload when content type is utf8 json', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);
    escherRequestOptions.setHeader(['content-type', 'application/json;charset=utf-8']);

    this.sandbox.stub(request, 'post').callsFake(function(options, callback) {
      try {
        expect(options.body).to.eql('{"name":"Almanach"}');
        callback(null, createDummyResponse());
      } catch (e) {
        callback(e, createDummyResponse());
      }
    });

    return escherRequest.post('/path', { name: 'Almanach' });
  });

  it('should skip encoding of payload when content type is not json', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);
    escherRequestOptions.setHeader(['content-type', 'text/csv']);

    this.sandbox.stub(request, 'post').callsFake(function(options, callback) {
      try {
        expect(options.body).to.eql('header1;header2');
        callback(null, createDummyResponse());
      } catch (e) {
        callback(e, createDummyResponse());
      }
    });

    return escherRequest.post('/path', 'header1;header2');
  });

  it('signs extra headers too', function() {
    escherRequestOptions.setHeader(['extra-header', 'header-value']);
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);

    this.sandbox.stub(request, 'get').callsFake(function(options, callback) {
      expect(options.headers['x-ems-auth'])
        .to.have.string('SignedHeaders=content-type;extra-header;host;x-ems-date,');
      callback(null, createDummyResponse());
    });

    escherRequest.get('/path');
  });

  it('should sign the payload of POST request', function() {
    let escherRequest = EscherRequest.create('key', 'secret', escherRequestOptions);
    let payload = { name: 'Test' };
    this.sandbox.spy(Escher.prototype, 'signRequest');

    this.sandbox.stub(request, 'post').callsFake(function(options, callback) {
      callback(null, createDummyResponse());
    });

    escherRequest.post('/path', payload);

    expect(Escher.prototype.signRequest.callCount).to.eql(1);
    let firstCall = Escher.prototype.signRequest.getCall(0);
    expect(firstCall.args[1]).to.eql(JSON.stringify(payload));
  });
});
