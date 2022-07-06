import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';
import PayablesService from './services/PayablesService';
import UserInfoService from './services/UserInfoService';
import ReceivableService from './services/ReceivableService';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  payables: PayablesService;
  profile: UserInfoService;
  receivable: ReceivableService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
    this.payables = new PayablesService({ config });
    this.profile = new UserInfoService({ config });
    this.receivable = new ReceivableService({ config });
  }
}

export default ApiService;
