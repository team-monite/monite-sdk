import { action, makeObservable } from 'mobx';
import { GrantType } from '@team-monite/sdk-api';

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
      res = await this.rootStore.monite?.api.auth.getAuthToken({
        grant_type: GrantType.ENTITY_USER,
        client_id: data.email,
        client_secret: data.password,
        // TODO remove hardcoded value
        entity_user_id: '5b4daced-6b9a-4707-83c6-08193d999fab',
      });
    } catch (err) {
      res = null;
    }

    if (!res) {
      return {
        success: false,
      };
    }

    this.processAuthToken(res.access_token);

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
