const emptyModule = {
  // fs module
  createReadStream: () => ({}),
  readFileSync: () => '',
  writeFileSync: () => {},
  existsSync: () => false,
  mkdirSync: () => {},
  readdir: () => {},
  stat: () => {},
  promises: {},
  readFile: () => Promise.resolve(''),
  writeFile: () => Promise.resolve(),
  createWriteStream: () => ({}),
  statSync: () => ({}),
  readdirSync: () => [],
  rmSync: () => {},
  constants: {},

  // path module
  join: (...args) => args.join('/'),
  resolve: (...args) => args.join('/'),
  dirname: (path) => path.split('/').slice(0, -1).join('/') || '/',
  basename: (path) => path.split('/').pop() || '',
  extname: (path) => {
    const match = path.match(/\.[^/.]+$/);
    return match ? match[0] : '';
  },
  sep: '/',
  delimiter: ':',
  relative: (_from, to) => to,
  normalize: (path) => path,
  isAbsolute: (path) => path.startsWith('/'),

  // crypto module
  createHash: () => ({
    update: () => {},
    digest: () => '',
  }),
  randomBytes: () => '',

  // http/https modules
  createServer: () => ({}),
  request: () => ({}),
  get: () => ({}),

  // buffer module
  Buffer: (typeof window !== 'undefined' && window.Buffer) || {
    from: () => '',
    alloc: () => '',
    toString: () => '',
  },

  // stream module
  Stream: class {},
  Readable: class {},
  Writable: class {},
  Transform: class {},
  PassThrough: class {},
  EventEmitter: class {},
  pipeline: () => {},
  finished: () => {},

  // util module - enhanced with more functions
  promisify: (fn) => fn,
  inspect: (obj) => String(obj),
  format: (...args) => args.join(' '),
  deprecate: (fn) => fn,
  inherits: (constructor, superConstructor) => {
    constructor.super_ = superConstructor;
    constructor.prototype = Object.create(superConstructor.prototype, {
      constructor: {
        value: constructor,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    });
  },
  callbackify: (fn) => fn,
  getSystemErrorName: () => 'UNKNOWN',
  isDeepStrictEqual: (a, b) => a === b,

  // os module
  platform: () => 'browser',
  arch: () => 'unknown',
  homedir: () => '/',
  tmpdir: () => '/tmp',
  hostname: () => 'localhost',
  type: () => 'Browser',
  release: () => 'unknown',
  uptime: () => 0,
  loadavg: () => [0, 0, 0],
  totalmem: () => 0,
  freemem: () => 0,
  cpus: () => [],
  networkInterfaces: () => ({}),
  endianness: () => 'LE',
  EOL: '\n',

  // tty module - enhanced
  isatty: () => false,
  ReadStream: class {
    constructor() {
      this.isTTY = false;
      this.fd = 0;
    }
    setRawMode() {
      return this;
    }
  },
  WriteStream: class {
    constructor() {
      this.isTTY = false;
      this.fd = 1;
    }
    getColorDepth() {
      return 4;
    }
    hasColors() {
      return false;
    }
    getWindowSize() {
      return [80, 24];
    }
    cursorTo() {
      return true;
    }
    clearLine() {
      return true;
    }
    clearScreenDown() {
      return true;
    }
  },
};

export const {
  // fs
  createReadStream,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdir,
  stat,
  promises,
  readFile,
  writeFile,
  createWriteStream,
  statSync,
  readdirSync,
  rmSync,
  constants,

  // path
  join,
  resolve,
  dirname,
  basename,
  extname,
  sep,
  delimiter,
  relative,
  normalize,
  isAbsolute,

  // crypto
  createHash,
  randomBytes,

  // http/https
  createServer,
  request,
  get,

  // buffer
  Buffer,

  // stream
  Stream,
  Readable,
  Writable,
  Transform,
  PassThrough,
  EventEmitter,
  pipeline,
  finished,

  // util
  promisify,
  inspect,
  format,
  deprecate,
  inherits,
  callbackify,
  getSystemErrorName,
  isDeepStrictEqual,

  // os
  platform,
  arch,
  homedir,
  tmpdir,
  hostname,
  type,
  release,
  uptime,
  loadavg,
  totalmem,
  freemem,
  cpus,
  networkInterfaces,
  endianness,
  EOL,

  // tty
  isatty,
  ReadStream,
  WriteStream,
} = emptyModule;

emptyModule.default = emptyModule;
export default emptyModule; 