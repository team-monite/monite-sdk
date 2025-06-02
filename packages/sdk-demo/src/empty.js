const emptyModule = {
  // fs module
  promises: {},
  readFile: () => Promise.resolve(''),
  writeFile: () => Promise.resolve(),
  existsSync: () => false,
  readFileSync: () => '',
  writeFileSync: () => {},
  createReadStream: () => ({}),
  createWriteStream: () => ({}),
  statSync: () => ({}),
  readdirSync: () => [],
  mkdirSync: () => {},
  rmSync: () => {},
  constants: {},

  // stream module
  Readable: class {},
  Writable: class {},
  Transform: class {},
  PassThrough: class {},
  Stream: class {},
  pipeline: () => {},
  finished: () => {},

  // util module
  promisify: (fn) => fn,
  inspect: (obj) => JSON.stringify(obj),
  format: (str) => str,
  inherits: () => {},
  deprecate: (fn, _msg) => fn,

  // path module
  join: (...args) => args.join('/'),
  resolve: (...args) => args.join('/'),
  dirname: (_path) => _path,
  basename: (_path) => _path,
  extname: (_path) => '',
  sep: '/',
  delimiter: ':',

  // os module
  platform: () => 'browser',
  arch: () => 'browser',
  homedir: () => '/',
  tmpdir: () => '/tmp',
  EOL: '\n',

  // tty module
  isatty: () => false,
  ReadStream: class {},
  WriteStream: class {},
};

// Set default export for compatibility
emptyModule.default = emptyModule;

// eslint-disable-next-line import/no-default-export
export default emptyModule;

export const {
  promises,
  readFile,
  writeFile,
  existsSync,
  readFileSync,
  writeFileSync,
  createReadStream,
  createWriteStream,
  statSync,
  readdirSync,
  mkdirSync,
  rmSync,
  constants,
  Readable,
  Writable,
  Transform,
  PassThrough,
  Stream,
  pipeline,
  finished,
  promisify,
  inspect,
  format,
  inherits,
  deprecate,
  join,
  resolve,
  dirname,
  basename,
  extname,
  sep,
  delimiter,
  platform,
  arch,
  homedir,
  tmpdir,
  EOL,
  isatty,
  ReadStream,
  WriteStream,
} = emptyModule;
