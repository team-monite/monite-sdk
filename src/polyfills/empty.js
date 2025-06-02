const emptyFunction = () => {};

const emptyProxy = new Proxy(emptyFunction, {
  get() {
    return emptyProxy;
  },
  set() {
    return true;
  },
  has() {
    return true;
  },
  apply() {
    return emptyProxy;
  },
  construct() {
    return emptyProxy;
  },
});

export default emptyProxy; 