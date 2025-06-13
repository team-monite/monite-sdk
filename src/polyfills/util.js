export function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

export function inspect(obj) {
  if (typeof obj === 'string') return `'${obj}'`;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (Array.isArray(obj)) return `[${obj.map(inspect).join(', ')}]`;
  if (typeof obj === 'object') {
    const pairs = Object.entries(obj).map(([k, v]) => `${k}: ${inspect(v)}`);
    return `{ ${pairs.join(', ')} }`;
  }
  return String(obj);
}

export function format(f, ...args) {
  let index = 0;
  return f.replace(/%[sdj%]/g, (match) => {
    if (match === '%%') return '%';
    if (index >= args.length) return match;
    switch (match) {
      case '%s': return String(args[index++]);
      case '%d': return Number(args[index++]);
      case '%j':
        try {
          return JSON.stringify(args[index++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return match;
    }
  });
}

export function inherits(ctor, superCtor) {
  if (superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }
}

export function deprecate(fn, msg) {
  let warned = false;
  return function deprecated(...args) {
    if (!warned) {
      console.warn(msg);
      warned = true;
    }
    return fn.apply(this, args);
  };
}

export const types = {
  isArray: Array.isArray,
  isBoolean: (val) => typeof val === 'boolean',
  isNull: (val) => val === null,
  isNullOrUndefined: (val) => val == null,
  isNumber: (val) => typeof val === 'number',
  isString: (val) => typeof val === 'string',
  isSymbol: (val) => typeof val === 'symbol',
  isUndefined: (val) => val === undefined,
  isRegExp: (val) => val instanceof RegExp,
  isObject: (val) => typeof val === 'object' && val !== null,
  isDate: (val) => val instanceof Date,
  isError: (val) => val instanceof Error,
  isFunction: (val) => typeof val === 'function',
  isPrimitive: (val) => val == null || (typeof val !== 'object' && typeof val !== 'function'),
  isBuffer: () => false,
};

export default {
  promisify,
  inspect,
  format,
  inherits,
  deprecate,
  types,
}; 