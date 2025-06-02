class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(listener);
    return this;
  }

  emit(event, ...args) {
    const listeners = this._events[event];
    if (listeners) {
      listeners.forEach(listener => listener.apply(this, args));
    }
    return this;
  }

  removeListener(event, listener) {
    const listeners = this._events[event];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    }
    return this;
  }
}

export class Readable extends EventEmitter {
  constructor() {
    super();
    this.readable = true;
  }

  read() {
    return null;
  }

  pipe(destination) {
    return destination;
  }
}

export class Writable extends EventEmitter {
  constructor() {
    super();
    this.writable = true;
  }

  write(_chunk, encoding, callback) {
    if (typeof encoding === 'function') {
      callback = encoding;
    }
    if (callback) callback();
    return true;
  }

  end(chunk, encoding, callback) {
    if (chunk) this.write(chunk, encoding);
    if (typeof encoding === 'function') callback = encoding;
    if (typeof chunk === 'function') callback = chunk;
    if (callback) callback();
    this.emit('finish');
  }
}

export class Transform extends Readable {
  constructor(options = {}) {
    super(options);
    this.writable = true;
  }

  _transform(chunk, _encoding, callback) {
    callback(null, chunk);
  }
}

export class PassThrough extends Transform {
  _transform(chunk, _encoding, callback) {
    callback(null, chunk);
  }
}

export default {
  Readable,
  Writable,
  Transform,
  PassThrough,
}; 