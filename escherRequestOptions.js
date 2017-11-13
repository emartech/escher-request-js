'use strict';

const _ = require('lodash');

class EscherRequestOptions {
  constructor(host, options = {}) {
    this.host = host;
    this.secure = options.secure !== false;
    this.port = options.port || 443;
    this.headers = [['content-type', 'application/json'], ['host', host]];
    this.prefix = '';
    this.timeout = 'timeout' in options ? options.timeout : 15000;
    this.allowEmptyResponse = false;
    _.extend(this, options);
  }

  setToSecure(port = 443) {
    this.port = port;
    this.secure = true;
  }

  setToUnsecure(port = 80) {
    this.port = port;
    this.secure = false;
  }

  setHost(host) {
    this.host = host;
  }

  getHost() {
    return this.host;
  }

  setPort(port) {
    this.port = port;
  }

  getPort() {
    return this.port;
  }

  setSecure(secure) {
    this.secure = secure;
  }

  getSecure() {
    return this.secure;
  }

  setHeader(headerToSet) {
    this.headers = this.headers
      .filter(this._headersExcept(headerToSet[0]))
      .concat([headerToSet]);
  }

  getHeader(name) {
    const result = _.find(this.headers, header => header[0].toLowerCase() === name.toLowerCase());

    return result ? result[1] : null;
  }

  setTimeout(timeout) {
    this.timeout = timeout;
  }

  getTimeout() {
    return this.timeout;
  }

  toHash() {
    const hash = {
      port: this.port,
      host: this.host,
      headers: this.headers,
      prefix: this.prefix,
      timeout: this.timeout
    };

    if (this.allowEmptyResponse) {
      hash.allowEmptyResponse = true;
    }

    return hash;
  }

  _headersExcept(headerKeyToSkip) {
    return existingHeader => existingHeader[0] !== headerKeyToSkip;
  }

  static create(host, options) {
    return new EscherRequestOptions(host, options);
  }

}

module.exports = EscherRequestOptions;
