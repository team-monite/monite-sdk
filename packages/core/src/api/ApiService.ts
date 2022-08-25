import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';
import PartnerApiService from './services/PartnerApiService';
import PaymentService from './services/PaymentService';
import AuthService from './services/AuthService';
import ReceivableService from './services/ReceivableService';
import WorkflowsService from './services/WorkflowsService';
import PayablesService from './services/PayableService';
import RoleService from './services/RoleService';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  partnerApi: PartnerApiService;
  auth: AuthService;
  payable: PayablesService;
  role: RoleService;
  receivable: ReceivableService;
  workflows: WorkflowsService;
  payment: PaymentService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
    this.partnerApi = new PartnerApiService({ config });
    this.auth = new AuthService({ config });
    this.receivable = new ReceivableService({ config });
    this.payable = new PayablesService({ config });
    this.role = new RoleService({ config });
    this.workflows = new WorkflowsService({ config });
    this.payment = new PaymentService({
      config: {
        ...config,
        BASE: 'http://pay.dev.monite.com/api/v1',
        HEADERS: {
          'x-monite-data-source': 'receivables',
        },
      },
    });
  }
}

export default ApiService;
