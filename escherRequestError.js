'use strict';

const _ = require('lodash');

class EscherRequestError extends Error {
  constructor(message, code, response) {
    super(message);
    this.name = 'EscherRequestError';
    this.code = code;
    if (response) {
      this.data = _.cloneDeep(response.data || response);
    } else {
      this.data = { replyText: message };
    }
    this.stack = new Error(message).stack;
  }
}

module.exports = EscherRequestError;
