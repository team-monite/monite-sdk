import '@monite/react-kit/dist/esm/monite.css';

import Core from './core';

function MoniteRoot(props) {
  const core = new Core(props);
  return core;
}

export default MoniteRoot;
