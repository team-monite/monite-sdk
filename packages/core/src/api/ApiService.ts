import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';
import PayablesService from './services/PayablesService';
import PaymentService from './services/PaymentService';
import AuthService from './services/AuthService';
import ReceivableService from './services/ReceivableService';
import WorkflowsService from './services/WorkflowsService';
class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  payables: PayablesService;
  auth: AuthService;
  receivable: ReceivableService;
  workflows: WorkflowsService;
  payment: PaymentService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
    this.payables = new PayablesService({ config });
    this.auth = new AuthService({ config });
    this.receivable = new ReceivableService({ config });
    this.workflows = new WorkflowsService({ config });
    //TODO: temporarily config for gateway
    this.payment = new PaymentService({
      config: {
        ...config,
        HEADERS: {
          'x-service-name': 'swagger',
          'x-monite-data-source': 'receivables',
        },
      },
    });
  }
}

export default ApiService;
