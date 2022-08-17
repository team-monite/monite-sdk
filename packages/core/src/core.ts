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
          'x-monite-entity-id': '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
        },
      },
    });

    if (locale) {
      this.locale = locale;
    }
  }
}

export default Core;
