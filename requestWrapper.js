'use strict';

const _ = require('lodash');
const request = require('request');
const Timer = require('timer-machine');
const EscherRequestError = require('./escherRequestError');
const logger = require('logentries-logformat')('escherrequest');
const debugLogger = require('logentries-logformat')('escherrequest-debug');

class RequestWrapper {
  constructor(requestOptions, protocol, payload) {
    this.requestOptions = requestOptions;
    this.protocol = protocol;
    this.payload = payload;
    debugLogger.log('request_options', requestOptions);
    debugLogger.log('protocol', protocol);
    debugLogger.log('payload', payload);
  }

  send() {
    return new Promise(function(resolve, reject) {
      this._sendRequest(resolve, reject);
    }.bind(this));
  }

  _sendRequest(resolve, reject) {
    const headers = {};
    const timer = new Timer(false);
    timer.start();
    this.requestOptions.headers.forEach(function(header) {
      headers[header[0]] = header[1];
    });

    const method = this.requestOptions.method.toLowerCase();

    const reqOptions = {
      uri: {
        hostname: this.requestOptions.host,
        port: this.requestOptions.port,
        protocol: this.protocol,
        pathname: this.requestOptions.path
      },
      headers: headers,
      timeout: this.requestOptions.timeout
    };
    debugLogger.log('wrapper_options', reqOptions);

    if (this.payload) {
      reqOptions.body = this.payload;
    }

    request[method](reqOptions, function(err, response) {
      if (err) {
        logger.error('fatal_error', err.message, this._getLogParameters());
        return reject(new EscherRequestError(err.message, 500));
      }

      if (response.statusCode >= 400) {
        logger.error('server_error', response.body.replyText, this._getLogParameters({
          code: response.statusCode
        }));
        return reject(new EscherRequestError(
          'Error in http response (status: ' + response.statusCode + ')',
          response.statusCode,
          response.body
        ));
      }

      if (!this.requestOptions.allowEmptyResponse && !response.body) {
        logger.error('server_error', 'empty response data', this._getLogParameters());
        return reject(new EscherRequestError('Empty http response', 500, response.statusMessage));
      }

      if (this._isJsonResponse(response)) {
        try {
          response.body = JSON.parse(response.body);
        } catch (ex) {
          logger.error('fatal_error', ex, this._getLogParameters());
          return reject(new EscherRequestError(ex.message, 500));
        }
      }

      timer.stop();
      logger.success('send', this._getLogParameters({ time: timer.time() }));

      return resolve(response);
    }.bind(this));

  }

  _isJsonResponse(response) {
    return response.headers['content-type'] &&
      response.headers['content-type'].indexOf('application/json') !== -1;
  }

  _getLogParameters(extraParametersToLog) {
    const requestParametersToLog = _.pick(this.requestOptions, ['method', 'host', 'url']);
    return _.extend({}, requestParametersToLog, extraParametersToLog);
  }

}

module.exports = RequestWrapper;
