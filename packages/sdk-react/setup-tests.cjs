/**
 * Jest Polyfill for Text Encoding and Crypto Subtle
 *
 * It's essential for ensuring the functionality of Dynamic Translations,
 * as it utilizes runtime-generated keys, which depend on these web APIs.
 *
 * This module provides a polyfill for global TextEncoder
 * classes, as well as the 'subtle' property of the crypto module, which
 * are not natively available in Jest's test environment.
 */

const { TextEncoder } = require('util');
const { webcrypto } = require('crypto');

if (!global.TextEncoder) Object.assign(global, { TextEncoder });
if (!crypto.subtle)
  Object.defineProperty(crypto, 'subtle', {
    value: webcrypto.subtle,
  });
