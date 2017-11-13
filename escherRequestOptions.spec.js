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

      expect(escherRequestOptions.constructor.name).to.eql('EscherRequestOptions');
    });

    it('creates an instance with default options', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost);

      expect(escherRequestOptions.getHost()).to.eql(dummyServiceHost);
      expect(escherRequestOptions.toHash()).to.eql({
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

      expect(escherRequestOptions.getHost()).to.eql(dummyServiceHost);
      expect(escherRequestOptions.toHash()).to.eql({
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

      expect(escherRequestOptions.constructor.name).to.eql('EscherRequestOptions');
    });

    it('creates an instance with proper configuration', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHost()).to.eql(dummyServiceHost);
      expect(escherRequestOptions.getPort()).to.eql(dummyServiceOptions.port);
    });

  });

  describe('#setHost()', function() {

    it('sets the host', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setHost('example.com');

      expect(escherRequestOptions.getHost()).to.eql('example.com');
    });

  });

  describe('#setToSecure()', function() {

    it('with no params sets the port to 443 and secure to true', function() {
      dummyServiceOptions.secure = false;
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToSecure();

      expect(escherRequestOptions.getPort()).to.eql(443);
      expect(escherRequestOptions.getSecure()).to.eql(true);
    });

    it('with port sets the port to the defined and secure to true', function() {
      dummyServiceOptions.secure = false;
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToSecure(666);

      expect(escherRequestOptions.getPort()).to.eql(666);
      expect(escherRequestOptions.getSecure()).to.eql(true);
    });

  });

  describe('#setToUnsecure()', function() {

    it('with no params sets the port to 80 and secure to false', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToUnsecure();

      expect(escherRequestOptions.getPort()).to.eql(80);
      expect(escherRequestOptions.getSecure()).to.eql(false);
    });

    it('with port sets the port to the defined and secure to false', function() {
      dummyServiceOptions.secure = false;
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setToUnsecure(666);

      expect(escherRequestOptions.getPort()).to.eql(666);
      expect(escherRequestOptions.getSecure()).to.eql(false);
    });

  });

  describe('#setSecure()', function() {

    it('sets the secure', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setSecure(false);

      expect(escherRequestOptions.getSecure()).to.eql(false);
    });

  });

  describe('#setPort()', function() {

    it('sets the port', function() {
      const escherRequestOptions = EscherRequestOptions.create(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setPort(666);

      expect(escherRequestOptions.getPort()).to.eql(666);
    });

  });

  describe('header handling', function() {

    it('can accept additional headers', function() {
      const dummyHeader = ['header-name', 'header-value'];
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      escherRequestOptions.setHeader(dummyHeader);

      expect(escherRequestOptions.getHeader('header-name')).to.eql('header-value');
    });

    it('should add default content type', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHeader('content-type')).to.eql('application/json');
    });

    it('should not duplicate headers with same name', function() {
      const expectedContentTypeHeader = ['content-type', 'text/csv'];
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      escherRequestOptions.setHeader(expectedContentTypeHeader);

      expect(escherRequestOptions.getHeader('content-type')).to.eql('text/csv');
    });

  });

  describe('allowEmptyResponse', function() {
    it('should be set to false by default', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.allowEmptyResponse).to.eql(false);
    });

    it('should be set to the value provided in config', function() {
      dummyServiceOptions.allowEmptyResponse = true;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.allowEmptyResponse).to.eql(true);
    });
  });

  describe('timeout', function() {
    it('should return a default value if options.timeout is not defined', function() {
      delete dummyServiceOptions.timeout;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getTimeout()).to.be.eql(15000);
    });

    it('should return the timeout passed in the constructor', function() {
      dummyServiceOptions.timeout = 0;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getTimeout()).to.be.eql(0);
    });

    it('should return the timeout set by setTimeout', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);
      escherRequestOptions.setTimeout(60000);

      expect(escherRequestOptions.getTimeout()).to.be.eql(60000);
    });

  });

  describe('toHash', function() {

    it('should return the proper object', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.toHash()).to.be.eql({
        headers: [
          ['content-type', 'application/json'],
          ['host', 'localhost']
        ],
        host: 'localhost',
        port: 1234,
        prefix: '/api',
        timeout: 60
      });
      expect(escherRequestOptions.toHash()).to.not.have.property('allowEmptyResponse');
    });

    it('should add allowEmptyResponse to hash if set to TRUE', function() {
      dummyServiceOptions.allowEmptyResponse = true;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.toHash()).to.have.property('allowEmptyResponse', true);
    });

  });

});
