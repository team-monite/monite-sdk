import ApiService from './api/ApiService';

export type CoreConfig = {
  apiKey: string;
  locale?: string;
  entityId: string;
};

class Core {
  api: ApiService;

  locale: string = 'en';

  constructor({ locale, apiKey, entityId }: CoreConfig) {
    this.api = new ApiService({
      config: {
        TOKEN: apiKey,
        HEADERS: {
          'x-monite-entity-id': entityId,
        },
      },
    });

    if (locale) {
      this.locale = locale;
    }
  }
}

export default Core;
