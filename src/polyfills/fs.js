export const promises = {
  readFile: () => Promise.reject(new Error('fs.readFile not available in browser')),
  writeFile: () => Promise.reject(new Error('fs.writeFile not available in browser')),
  access: () => Promise.reject(new Error('fs.access not available in browser')),
  mkdir: () => Promise.reject(new Error('fs.mkdir not available in browser')),
  readdir: () => Promise.reject(new Error('fs.readdir not available in browser')),
};

export const readFileSync = () => {
  throw new Error('fs.readFileSync not available in browser');
};

export const writeFileSync = () => {
  throw new Error('fs.writeFileSync not available in browser');
};

export const existsSync = () => false;

export const mkdirSync = () => {
  throw new Error('fs.mkdirSync not available in browser');
};

export const readdirSync = () => {
  throw new Error('fs.readdirSync not available in browser');
};

export const createReadStream = () => {
  throw new Error('fs.createReadStream not available in browser');
};

export const createWriteStream = () => {
  throw new Error('fs.createWriteStream not available in browser');
};

export default {
  promises,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  createReadStream,
  createWriteStream,
}; 