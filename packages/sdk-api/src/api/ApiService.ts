import { OpenAPIConfig } from './OpenAPI';

import CounterpartsService from './services/CounterpartsService';
import PartnerApiService from './services/PartnerApiService';
import PaymentService from './services/PaymentService';
import AuthService from './services/AuthService';
import ReceivableService from './services/ReceivableService';
import WorkflowsService from './services/WorkflowsService';
import PayablesService from './services/PayableService';
import RoleService from './services/RoleService';
import TagService from './services/TagService';

const isLocalhost = (url: string) =>
  url.includes('localhost') || url.includes('127.0.0.1');

const PAYMENT_BASE_URL = isLocalhost(window.location.origin)
  ? 'http://pay.dev.monite.com/api/v1'
  : '/api/v1';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  partnerApi: PartnerApiService;
  auth: AuthService;
  payable: PayablesService;
  tag: TagService;
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
    this.tag = new TagService({ config });
    this.role = new RoleService({ config });
    this.workflows = new WorkflowsService({ config });
    this.payment = new PaymentService({
      config: {
        ...config,
        BASE: PAYMENT_BASE_URL,
        HEADERS: {
          'x-monite-data-source': 'receivables',
        },
      },
    });
  }
}

export default ApiService;
