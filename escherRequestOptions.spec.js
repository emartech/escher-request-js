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
      credentialScope: 'eu/dummy/ems_request'
    };
  });

  describe('constructor()', function() {

    it('creates an EscherRequestOptions instance', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.constructor.name).to.eql('EscherRequestOptions');
    });

    it('creates an instance with proper configuration', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getHost()).to.eql(dummyServiceHost);
      expect(escherRequestOptions.getPort()).to.eql(dummyServiceOptions.port);
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
    it('should return a default value', function() {
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, dummyServiceOptions);

      expect(escherRequestOptions.getTimeout()).to.be.eql(15000);
    });

    it('should return the timeout passed in the constructor', function() {
      const options = Object.assign({}, dummyServiceOptions);
      options.timeout = 0;
      const escherRequestOptions = new EscherRequestOptions(dummyServiceHost, options);

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
        timeout: 15000
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
