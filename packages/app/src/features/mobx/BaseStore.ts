import { RootStore, State } from 'features/types';

class BaseStore {
  protected rootStore: RootStore;

  state: State;

  constructor(state: State, rootStore: RootStore) {
    this.rootStore = rootStore;
    this.state = state;
  }

  setState = (state: State) => {
    this.state = state;
  };
}

export default BaseStore;
