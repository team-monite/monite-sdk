// Crypto polyfill for Lingui message ID generation
// This ensures crypto.createHash works properly in the browser
let cryptoPolyfill;

if (typeof window !== 'undefined') {
  try {
    cryptoPolyfill = require('crypto-browserify');
  } catch (error) {
    cryptoPolyfill = {
      createHash: (algorithm) => {
        if (algorithm !== 'sha256') {
          throw new Error(`Unsupported algorithm: ${algorithm}`);
        }

        let data = '';

        return {
          update: (chunk) => {
            data += chunk;
            return this;
          },
          digest: (encoding) => {
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
              const char = data.charCodeAt(i);
              hash = (hash << 5) - hash + char;
              hash = hash & hash;
            }

            const hashString = Math.abs(hash).toString(16);

            if (encoding === 'hex') {
              return hashString;
            }
            return hashString;
          },
        };
      },
    };
  }
} else {
  cryptoPolyfill = require('crypto');
}

// Make crypto available globally for Lingui
if (typeof window !== 'undefined' && !window.crypto1) {
  window.crypto1 = cryptoPolyfill;
}

module.exports = cryptoPolyfill;
