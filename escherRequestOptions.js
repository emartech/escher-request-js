'use strict';

class EscherRequestOptions {
  constructor(host, options = {}) {
    this._options = Object.assign({
      secure: true,
      port: 443,
      headers: [['content-type', 'application/json'], ['host', host]],
      prefix: '',
      timeout: 15000,
      allowEmptyResponse: false,
      credentialScope: false
    }, options, { host });
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

  getHeader(nameToFind) {
    const nameToFindLowercased = nameToFind.toLowerCase();
    for (const [name, value] of this._options.headers) {
      if (name.toLowerCase() === nameToFindLowercased) { return value; }
    }
    return null;
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
