import ApiService from './api/ApiService';

export type CoreConfig = {
  apiKey: string;
};

class Core {
  api: ApiService;

  constructor({ apiKey }: CoreConfig) {
    this.api = new ApiService({
      config: {
        HEADERS: {
          'x-api-key': apiKey,
        },
      },
    });
  }
}

export default Core;
