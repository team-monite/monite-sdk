import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';
import PayablesService from './services/PayablesService';
import UserInfoService from './services/UserInfoService';
import PaymentService from './services/PaymentService';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  payables: PayablesService;
  profile: UserInfoService;
  payments: PaymentService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
    this.payables = new PayablesService({ config });
    this.profile = new UserInfoService({ config });
    this.payments = new PaymentService({ config });
  }
}

export default ApiService;
