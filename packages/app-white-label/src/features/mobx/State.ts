import { extendObservable, toJS } from 'mobx';
import { deepObserve } from 'mobx-utils';

import { AUTH_TOKEN_STORAGE_KEY } from 'features/app/consts';
import type { State as StateType } from 'features/mobx/types';

const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

// single state pattern
export class State {
  constructor(data?: StateType) {
    const initialState: StateType = {
      auth: {
        token,
      },
      ...data,
    };

    extendObservable(this, initialState);
  }
}

export const initState = (data?: StateType): StateType => {
  const state = new State(data) as StateType;

  if (process.env.NODE_ENV === 'development') {
    console.log('Mobx state init:', toJS(state));
    deepObserve(state, (change, path) => {
      console.log('Mobx state change:', path, change, toJS(state));
    });
  }

  return state;
};

export const state = initState();
