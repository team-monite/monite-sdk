import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
  }
}

export default ApiService;
