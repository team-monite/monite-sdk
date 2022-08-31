import ApiService from './api/ApiService';
import { AUTH_TOKEN_STORAGE_KEY } from '@monite/app-white-label/src/features/app/consts';

export type CoreConfig = {
  apiKey: string;
  locale?: string;
};

class Core {
  api: ApiService;

  locale: string = 'en';

  constructor({ locale }: CoreConfig) {
    this.api = new ApiService({
      config: {
        HEADERS: {
          Authorization:
            'Bearer ' + localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
          // TODO refactor auth flow and remove hardcoded value
          'x-monite-entity-id': 'ec74ceb6-d1ef-4898-b5b3-d2520a52c073',
        },
      },
    });

    if (locale) {
      this.locale = locale;
    }
  }
}

export default Core;
