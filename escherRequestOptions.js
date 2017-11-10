'use strict';

const _ = require('lodash');

class EscherRequestOptions {
  constructor(environment, options = {}) {
    this.secure = options.secure !== false;
    this.port = options.port || 443;
    this.host = environment;
    this.rejectUnauthorized = options.rejectUnauthorized !== false;
    this.headers = [['content-type', 'application/json'], ['host', environment]];
    this.prefix = '';
    this.timeout = 'timeout' in options ? options.timeout : 15000;
    this.allowEmptyResponse = false;
    _.extend(this, options);
  }

  setToSecure(port = 443, rejectUnauthorized) {
    this.port = port;
    this.secure = true;
    this.rejectUnauthorized = rejectUnauthorized;
  }

  setToUnsecure(port) {
    this.port = port || 80;
    this.secure = false;
  }

  setEnvironment(environment) {
    this.host = environment;
  }

  setPort(port) {
    this.port = port;
  }

  setHeader(headerToSet) {
    this.headers = this.headers
      .filter(this._headersExcept(headerToSet[0]))
      .concat([headerToSet]);
  }

  getHeader(name) {
    let result = _.find(this.headers, function(header) {
      return header[0].toLowerCase() === name.toLowerCase();
    });

    return result ? result[1] : null;
  }

  setTimeout(timeout) {
    this.timeout = timeout;
  }

  getTimeout() {
    return this.timeout;
  }

  toHash() {
    let hash = {
      port: this.port,
      host: this.host,
      headers: this.headers,
      prefix: this.prefix,
      timeout: this.timeout
    };

    if (!this.rejectUnauthorized) {
      hash.rejectUnauthorized = false;
    }

    if (this.allowEmptyResponse) {
      hash.allowEmptyResponse = true;
    }

    return hash;
  }

  _headersExcept(headerKeyToSkip) {
    return function(existingHeader) {
      return existingHeader[0] !== headerKeyToSkip;
    };
  }

  static createForInternalApi(environment, rejectUnauthorized) {
    return createEscherRequestOptions('/api/v2/internal', environment, rejectUnauthorized);
  }

  static createForServiceApi(environment, rejectUnauthorized) {
    return createEscherRequestOptions('/api/services', environment, rejectUnauthorized);
  }

  static create(environment, prefix, rejectUnauthorized) {
    return createEscherRequestOptions(prefix, environment, rejectUnauthorized);
  }

}

let createEscherRequestOptions = function(prefix, environment, rejectUnauthorized) {
  let options = {};

  if (typeof environment === 'object') {
    options = environment;
    environment = options.environment;
  } else {
    options.rejectUnauthorized = rejectUnauthorized;
  }

  options.prefix = prefix;

  return new EscherRequestOptions(environment, options);
};


module.exports = EscherRequestOptions;
