'use strict';

const _ = require('lodash');
const Escher = require('escher-auth');
const EscherRequestOptions = require('./escherRequestOptions');
const EscherRequestError = require('./escherRequestError');
const RequestWrapper = require('./requestWrapper');
const logger = require('logentries-logformat')('escherrequest');

class EscherRequest {

  constructor(key, secret, options) {
    const escherOptions = {
      accessKeyId: key,
      apiSecret: secret,
      credentialScope: options.getCredentialScope() || 'eu/suite/ems_request',
      algoPrefix: 'EMS',
      vendorKey: 'EMS',
      authHeaderName: 'X-Ems-Auth',
      dateHeaderName: 'X-Ems-Date'
    };
    this._escher = new Escher(escherOptions);
    this._options = options;
  }

  get(path) {
    return this._request('GET', path);
  }

  post(path, data) {
    return this._request('POST', path, data);
  }

  put(path, data) {
    return this._request('PUT', path, data);
  }

  delete(path) {
    return this._request('DELETE', path);
  }

  _request(method, path, data) {
    const options = this._getOptionsFor(method, path);
    const payload = data ? this._getPayload(data) : '';
    const signedOptions = this._signRequest(options, payload);

    logger.log('send', this._getLogParameters(options));
    return this._getRequestFor(signedOptions, payload).send();
  }

  _getRequestFor(requestOptions, payload) {
    const protocol = this._options.getSecure() ? 'https:' : 'http:';
    return new RequestWrapper(requestOptions, protocol, payload);
  }

  _getOptionsFor(type, path) {
    const defaultOptions = _.cloneDeep(this._options.toHash());
    const realPath = defaultOptions.prefix + path;

    return _.merge(defaultOptions, {
      method: type,
      url: realPath,
      path: realPath
    });
  }

  _signRequest(options, payload) {
    const headerNames = options.headers.map(header => header[0]);

    return this._escher.signRequest(options, payload, headerNames);
  }

  _getLogParameters(options) {
    return _.pick(options, ['method', 'host', 'url']);
  }

  _getPayload(data) {
    if (this._options.getHeader('content-type').indexOf('application/json') === -1) {
      return data;
    }

    return JSON.stringify(data);
  }

  static create(key, secret, options) {
    return new EscherRequest(key, secret, options);
  }

}

module.exports = EscherRequest;
module.exports.Options = EscherRequestOptions;
module.exports.Error = EscherRequestError;
