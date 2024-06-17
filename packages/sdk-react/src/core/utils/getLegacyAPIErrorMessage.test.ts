import { getLegacyAPIErrorMessage } from '@/core/utils/getLegacyAPIErrorMessage';

describe('getMessageInError', () => {
  it('should return the message from an error body object', () => {
    const error = {
      body: {
        error: {
          message: 'Error message',
        },
      },
    };

    expect(getLegacyAPIErrorMessage(error)).toBe('Error message');
  });

  it('should return the message from an error object', () => {
    const error = {
      message: 'Error message',
    };

    expect(getLegacyAPIErrorMessage(error)).toBe('Error message');
  });

  it('should return undefined if the error body object does not contain a message', () => {
    const error = {
      body: {
        error: {},
      },
    };

    expect(getLegacyAPIErrorMessage(error)).toBeUndefined();
  });

  it('should return undefined if the error object does not contain a message', () => {
    const error = {};

    expect(getLegacyAPIErrorMessage(error)).toBeUndefined();
  });

  it('should return undefined if the error object is not an object', () => {
    const error = 'Error message';

    expect(getLegacyAPIErrorMessage(error)).toBeUndefined();
  });

  it('should return undefined if the error object is null', () => {
    const error = null;

    expect(getLegacyAPIErrorMessage(error)).toBeUndefined();
  });

  it('should return undefined if the error object is undefined', () => {
    const error = undefined;

    expect(getLegacyAPIErrorMessage(error)).toBeUndefined();
  });
});
