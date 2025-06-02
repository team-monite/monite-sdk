export const sep = '/';
export const delimiter = ':';
export const posix = {
  sep: '/',
  delimiter: ':',
};

export function join(...paths) {
  if (paths.length === 0) return '.';
  const joinedPath = paths
    .filter(Boolean)
    .join('/')
    .replace(/\/+/g, '/');
  return joinedPath || '.';
}

export function resolve(...paths) {
  const resolvedPath = paths.join('/').replace(/\/+/g, '/');
  return resolvedPath.startsWith('/') ? resolvedPath : '/' + resolvedPath;
}

export function dirname(path) {
  const lastSlash = path.lastIndexOf('/');
  return lastSlash === -1 ? '.' : path.substring(0, lastSlash) || '/';
}

export function basename(path, ext) {
  const lastSlash = path.lastIndexOf('/');
  const name = lastSlash === -1 ? path : path.substring(lastSlash + 1);
  return ext && name.endsWith(ext) ? name.substring(0, name.length - ext.length) : name;
}

export function extname(path) {
  const lastDot = path.lastIndexOf('.');
  const lastSlash = path.lastIndexOf('/');
  return lastDot > lastSlash ? path.substring(lastDot) : '';
}

export function isAbsolute(path) {
  return path.startsWith('/');
}

export function relative(_from, to) {
  return to;
}

export function normalize(path) {
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

export default {
  sep,
  delimiter,
  posix,
  join,
  resolve,
  dirname,
  basename,
  extname,
  isAbsolute,
  relative,
  normalize,
}; 