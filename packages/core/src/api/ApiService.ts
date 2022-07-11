import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';
import PayablesService from './services/PayablesService';
import UserInfoService from './services/UserInfoService';
import ReceivableService from './services/ReceivableService';
import WorkflowsService from './services/WorkflowsService';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  payables: PayablesService;
  profile: UserInfoService;
  receivable: ReceivableService;
  workflows: WorkflowsService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
    this.payables = new PayablesService({ config });
    this.profile = new UserInfoService({ config });
    this.receivable = new ReceivableService({ config });
    this.workflows = new WorkflowsService({ config });
  }
}

export default ApiService;
