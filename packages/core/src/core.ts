import ApiService from './api/ApiService';
import { AUTH_TOKEN_STORAGE_KEY } from '@monite/sdk-app/src/features/app/consts';

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
          'x-monite-entity-id': 'b306679d-dd88-45d6-b0f2-ba14464fd4a0',
        },
      },
    });

    if (locale) {
      this.locale = locale;
    }
  }
}

export default Core;
