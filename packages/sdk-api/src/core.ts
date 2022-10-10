import ApiService from './api/ApiService';

export type CoreConfig = {
  token: string;
  locale?: string;
  entityId?: string;
};

class Core {
  api: ApiService;

  locale: string = 'en';

  constructor({ locale, token, entityId }: CoreConfig) {
    this.api = new ApiService({
      config: {
        TOKEN: token,
        HEADERS: {
          'x-monite-entity-id': entityId || '',
        },
      },
    });

    if (locale) {
      this.locale = locale;
    }
  }
}

export default Core;
