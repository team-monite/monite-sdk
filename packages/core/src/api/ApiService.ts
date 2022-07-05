import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';
import PayablesService from './services/PayablesService';
import UserInfoService from './services/UserInfoService';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  payables: PayablesService;
  profile: UserInfoService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
    this.payables = new PayablesService({ config });
    this.profile = new UserInfoService({ config });
  }
}

export default ApiService;
