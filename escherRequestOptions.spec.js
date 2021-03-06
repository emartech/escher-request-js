'use strict';

const EscherRequestOptions = require('./escherRequestOptions');

describe('EscherRequestOptions', function() {

  let dummyServiceOptions;
  let dummyServiceHost;

  beforeEach(function() {
    dummyServiceHost = 'localhost';
    dummyServiceOptions = {
      port: 1234,
      prefix: '/api',
      secure: true,
      timeout: 60
    };
  });

  describe('constructor()', function() {

    it('creates an EscherRequestOptions instance', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost);

      expect(escherRequestOptions.constructor.name).to.eq('EscherRequestOptions');
    });

    it('creates an instance with default options', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost);

      expect(escherRequestOptions.getHost()).to.eq(dummyServiceHost);
      expect(escherRequestOptions.toHash()).to.eql({
        allowEmptyResponse: false,
        headers: [
          ['content-type', 'application/json'],
          ['host', 'localhost']
        ],
        host: 'localhost',
        port: 443,
        prefix: '',
        timeout: 15000
      });
    });

    it('creates an instance with specified options', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHost()).to.eq(dummyServiceHost);
      expect(escherRequestOptions.toHash()).to.eql({
        allowEmptyResponse: false,
        headers: [
          ['content-type', 'application/json'],
          ['host', 'localhost']
        ],
        host: 'localhost',
        port: 1234,
        prefix: '/api',
        timeout: 60
      });
    });

  });

  describe('.create()', function() {

    it('creates an EscherRequestOptions instance', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.constructor.name).to.eq('EscherRequestOptions');
    });

    it('creates an instance with proper configuration', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHost()).to.eq(dummyServiceHost);
      expect(escherRequestOptions.getPort()).to.eq(dummyServiceOptions.port);
    });

  });

  describe('#setHost()', function() {

    it('sets the host', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setHost('example.com');

      expect(escherRequestOptions.getHost()).to.eq('example.com');
    });

  });

  describe('#setToSecure()', function() {

    it('with no params sets the port to 443 and secure to true', function() {
      dummyServiceOptions.secure = false;
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToSecure();

      expect(escherRequestOptions.getPort()).to.eq(443);
      expect(escherRequestOptions.getSecure()).to.eq(true);
    });

    it('with port sets the port to the defined and secure to true', function() {
      dummyServiceOptions.secure = false;
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToSecure(666);

      expect(escherRequestOptions.getPort()).to.eq(666);
      expect(escherRequestOptions.getSecure()).to.eq(true);
    });

  });

  describe('#setToUnsecure()', function() {

    it('with no params sets the port to 80 and secure to false', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToUnsecure();

      expect(escherRequestOptions.getPort()).to.eq(80);
      expect(escherRequestOptions.getSecure()).to.eq(false);
    });

    it('with port sets the port to the defined and secure to false', function() {
      dummyServiceOptions.secure = false;
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToUnsecure(666);

      expect(escherRequestOptions.getPort()).to.eq(666);
      expect(escherRequestOptions.getSecure()).to.eq(false);
    });

  });

  describe('#setSecure()', function() {

    it('sets the secure', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setSecure(false);

      expect(escherRequestOptions.getSecure()).to.eq(false);
    });

  });

  describe('#setPort()', function() {

    it('sets the port', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setPort(666);

      expect(escherRequestOptions.getPort()).to.eq(666);
    });

  });

  describe('header handling', function() {

    it('can accept additional headers', function() {
      const dummyHeader = ['header-name', 'header-value'];
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      escherRequestOptions.setHeader(dummyHeader);

      expect(escherRequestOptions.getHeader('header-name')).to.eq('header-value');
    });

    it('should add default content type', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHeader('content-type')).to.eq('application/json');
    });

    it('should not duplicate headers with same name', function() {
      const expectedContentTypeHeader = ['content-type', 'text/csv'];
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      escherRequestOptions.setHeader(expectedContentTypeHeader);

      expect(escherRequestOptions.getHeader('content-type')).to.eq('text/csv');
    });

    it('#getHeader should respond with null if header is missing', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHeader('unknown')).to.eq(null);
    });

    it('#getHeaders should list all the headers', function() {
      const expectedHeaders = [
        ['content-type', 'application/json'],
        ['host', dummyServiceHost]
      ];
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHeaders()).to.eql(expectedHeaders);
    });

  });

  describe('allowEmptyResponse handling', function() {
    it('should be set to false by default', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getAllowEmptyResponse()).to.eq(false);
    });

    it('should be set to the value provided in config', function() {
      dummyServiceOptions.allowEmptyResponse = true;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getAllowEmptyResponse()).to.eq(true);
    });
  });

  describe('timeout handling', function() {
    it('should return a default value if options.timeout is not defined', function() {
      delete dummyServiceOptions.timeout;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getTimeout()).to.be.eq(15000);
    });

    it('should return the timeout passed in the constructor', function() {
      dummyServiceOptions.timeout = 0;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getTimeout()).to.be.eq(0);
    });

    it('should return the timeout set by setTimeout', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setTimeout(60000);

      expect(escherRequestOptions.getTimeout()).to.be.eq(60000);
    });

  });

  describe('credentialScope handling', function() {
    it('#setCredentialScope should set credentialScope', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setCredentialScope('eu/test/ems_request');

      expect(escherRequestOptions.getCredentialScope()).to.be.eq('eu/test/ems_request');
    });
  });

});
