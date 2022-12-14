import ApiService from './api/ApiService';

export type CoreConfig = {
  token: string;
  apiUrl?: string;
  locale?: string;
  entityId?: string;
};

class Core {
  api: ApiService;
  locale: string = 'en';
  entityId: string = '';

  constructor({ token, apiUrl, locale, entityId }: CoreConfig) {
    this.api = new ApiService({
      config: {
        BASE: apiUrl,
        TOKEN: token,
        HEADERS: {
          'x-monite-entity-id': entityId || '',
        },
      },
    });

    if (locale) this.locale = locale;
    if (entityId) this.entityId = entityId;
  }
}

export default Core;
