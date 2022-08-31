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
          'x-monite-entity-id': 'e9c312ce-0300-4d77-a748-cf64066ae54a',
        },
      },
    });

    if (locale) {
      this.locale = locale;
    }
  }
}

export default Core;
