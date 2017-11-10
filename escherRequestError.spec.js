'use strict';

const EscherRequestError = require('./escherRequestError');

describe('EscherRequestError', function() {
  it('should extend base Error class', function() {
    const error = new EscherRequestError();

    expect(error).to.be.an.instanceOf(Error);
  });

  it('should store constructor parameters', function() {
    const error = new EscherRequestError('Invalid request', 400, {
      data: {
        replyText: 'Too long',
        detailedMessage: 'Line too long'
      }
    });

    expect(error.message).to.eql('Invalid request');
    expect(error.code).to.eql(400);
    expect(error.data).to.eql({
      replyText: 'Too long',
      detailedMessage: 'Line too long'
    });
  });

  it('should store response as is when no data attribute present', function() {
    const error = new EscherRequestError('Invalid request', 400, {
      replyText: 'Too long',
      detailedMessage: 'Line too long'
    });

    expect(error.message).to.eql('Invalid request');
    expect(error.code).to.eql(400);
    expect(error.data).to.eql({
      replyText: 'Too long',
      detailedMessage: 'Line too long'
    });
  });

  it('should always contain data on error', function() {
    const error = new EscherRequestError('Unauthorized');

    expect(error.data).to.eql({ replyText: 'Unauthorized' });
  });
});
