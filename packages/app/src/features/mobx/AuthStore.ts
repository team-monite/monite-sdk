import { makeObservable, action } from 'mobx';

import { AUTH_TOKEN_STORAGE_KEY } from 'features/app/consts';

import type { RootStore, State } from 'features/types';

import BaseStore from './BaseStore';

class AuthStore extends BaseStore {
  constructor(state: State, rootStore: RootStore) {
    super(state, rootStore);

    makeObservable(this, {
      setAuthUserToken: action,
    });
  }

  get authUserToken() {
    return this.state.auth.token;
  }

  get isAuth() {
    return !!this.state.auth.token;
  }

  setAuthUserToken = (token: string | null) => {
    this.state.auth.token = token;
  };

  private processAuthToken = (token?: string | null) => {
    if (!token) {
      return;
    }

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    this.setAuthUserToken(token);
  };

  authorizeByLoginPassword = async (data: {
    email: string;
    password: string;
  }) => {
    // TODO: make real API signin by email and password request here instead of API key checking

    let res;
    try {
      res = await this.rootStore.monite?.api.profile.getInfo({
        openapiConfig: {
          HEADERS: {
            'x-api-key': data.email,
          },
        },
      });
    } catch (err) {
      res = null;
    }

    if (!res) {
      return {
        success: false,
      };
    }

    // TODO: replace data.email with the real API token here
    this.processAuthToken(data.email);

    return {
      success: true,
      token: data.email,
    };
  };

  logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    this.setAuthUserToken(null);
  };
}

export default AuthStore;
