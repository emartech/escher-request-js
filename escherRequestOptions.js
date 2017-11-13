'use strict';

const _ = require('lodash');

class EscherRequestOptions {
  constructor(host, options = {}) {
    options.host = host;
    options.secure = options.secure !== false;
    options.port = options.port || 443;
    options.headers = [['content-type', 'application/json'], ['host', host]];
    options.prefix = options.prefix || '';
    options.timeout = 'timeout' in options ? options.timeout : 15000;
    options.allowEmptyResponse = options.allowEmptyResponse || false;
    options.credentialScope = options.credentialScope || false;
    this._options = options;
  }

  setToSecure(port = 443) {
    this._options.port = port;
    this._options.secure = true;
  }

  setToUnsecure(port = 80) {
    this._options.port = port;
    this._options.secure = false;
  }

  setHost(host) {
    this._options.host = host;
  }

  getHost() {
    return this._options.host;
  }

  setPort(port) {
    this._options.port = port;
  }

  getPort() {
    return this._options.port;
  }

  setSecure(secure) {
    this._options.secure = secure;
  }

  getSecure() {
    return this._options.secure;
  }

  setHeader(headerToSet) {
    this._options.headers = this._options.headers
      .filter(this._headersExcept(headerToSet[0]))
      .concat([headerToSet]);
  }

  getHeaders() {
    return this._options.headers;
  }

  getHeader(name) {
    const result = _.find(this._options.headers, header => header[0].toLowerCase() === name.toLowerCase());

    return result ? result[1] : null;
  }

  setTimeout(timeout) {
    this._options.timeout = timeout;
  }

  getTimeout() {
    return this._options.timeout;
  }

  getPrefix() {
    return this._options.prefix;
  }

  getAllowEmptyResponse() {
    return this._options.allowEmptyResponse;
  }

  setCredentialScope(credentialScope) {
    this._options.credentialScope = credentialScope;
  }

  getCredentialScope() {
    return this._options.credentialScope;
  }

  toHash() {
    return {
      port: this.getPort(),
      host: this.getHost(),
      headers: this.getHeaders(),
      prefix: this.getPrefix(),
      timeout: this.getTimeout(),
      allowEmptyResponse: this.getAllowEmptyResponse()
    };
  }

  _headersExcept(headerKeyToSkip) {
    return existingHeader => existingHeader[0] !== headerKeyToSkip;
  }

  static create(host, options) {
    return new EscherRequestOptions(host, options);
  }

}

module.exports = EscherRequestOptions;
