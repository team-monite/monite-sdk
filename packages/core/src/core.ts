import ApiService from './api/ApiService';

export type CoreConfig = {
  apiKey: string;
  locale?: string;
};

class Core {
  api: ApiService;

  locale: string = 'en';

  constructor({ apiKey, locale }: CoreConfig) {
    this.api = new ApiService({
      config: {
        HEADERS: {
          'x-api-key': apiKey,
        },
      },
    });

    if (locale) {
      this.locale = locale;
    }
  }
}

export default Core;
