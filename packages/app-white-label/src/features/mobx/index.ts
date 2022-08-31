import { createContext, useContext } from 'react';
import { MoniteApp } from '@monite/sdk-api';

import { state } from 'features/mobx/State';
import { State } from 'features/types';

import AuthStore from './AuthStore';

export class RootStore {
  auth: AuthStore;
  state: State;
  monite?: MoniteApp;

  constructor(state: State) {
    this.auth = new AuthStore(state, this);

    this.state = state;
  }

  setMoniteApp(moniteAppInstance: MoniteApp) {
    this.monite = moniteAppInstance;
  }
}

export const store = new RootStore(state);

export const StoreContext = createContext<RootStore>(store);
export const useRootStore = (): RootStore => useContext(StoreContext);
