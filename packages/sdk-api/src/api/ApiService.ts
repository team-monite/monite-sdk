import { OpenAPIConfig } from './OpenAPI';

import OnboardingService from '../onboarding/services/OnboardingService';
import CounterpartsService from './services/CounterpartsService';
import CurrenciesInternalService from './services/CurrenciesInternalService';
import CounterpartsAddressesService from './services/CounterpartsAddressesService';
import PartnerApiService from './services/PartnerApiService';
import PaymentService from './services/PaymentService';
import AuthService from './services/AuthService';
import ReceivableService from './services/ReceivableService';
import PaymentTermsService from './services/PaymentTermsService';
import ProductsService from './services/ProductsService';
import MeasureUnitsService from './services/MeasureUnitsService';
import VatRatesService from './services/VatRatesService';
import WorkflowsService from './services/WorkflowsService';
import PayablesService from './services/PayableService';
import RoleService from './services/RoleService';
import TagService from './services/TagService';
import EntityUserService from './services/EntityUserService';
import EntityService from './services/EntityService';

const isLocalhost = (url: string) =>
  url.includes('localhost') || url.includes('127.0.0.1');

const PAYMENT_BASE_URL = isLocalhost(window.location.origin)
  ? 'https://pay.dev.monite.com/api/v1'
  : '/api/v1';

class ApiService {
  openapiConfig: Partial<OpenAPIConfig>;

  counterparts: CounterpartsService;
  currencies: CurrenciesInternalService;
  counterpartsAddresses: CounterpartsAddressesService;
  partnerApi: PartnerApiService;
  auth: AuthService;
  payable: PayablesService;
  tag: TagService;
  role: RoleService;
  receivable: ReceivableService;
  paymentTerms: PaymentTermsService;
  products: ProductsService;

  vatRates: VatRatesService;
  measureUnits: MeasureUnitsService;
  workflows: WorkflowsService;
  payment: PaymentService;
  entityUser: EntityUserService;
  entity: EntityService;
  onboarding: OnboardingService;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;

    this.counterparts = new CounterpartsService({ config });
    this.currencies = new CurrenciesInternalService({ config });
    this.counterpartsAddresses = new CounterpartsAddressesService({ config });
    this.partnerApi = new PartnerApiService({ config });
    this.auth = new AuthService({ config });
    this.receivable = new ReceivableService({ config });
    this.paymentTerms = new PaymentTermsService({ config });
    this.products = new ProductsService({ config });
    this.measureUnits = new MeasureUnitsService({ config });
    this.vatRates = new VatRatesService({ config });
    this.payable = new PayablesService({ config });
    this.tag = new TagService({ config });
    this.role = new RoleService({ config });
    this.workflows = new WorkflowsService({ config });
    this.entityUser = new EntityUserService({ config });
    this.entity = new EntityService({ config });
    this.onboarding = new OnboardingService({ config });
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
