import { OpenAPI, OpenAPIConfig } from './OpenAPI';
import {
  ApprovalPoliciesService,
  AuthService,
  CounterpartsAddressesService,
  CounterpartsService,
  CurrenciesInternalService,
  EntityService,
  EntityUserService,
  FilesService,
  InternalSettingsService,
  MeasureUnitsService,
  OnboardingDocumentsService,
  OnboardingService,
  PartnerApiService,
  PayableLineItemsService,
  PayablesService,
  PaymentService,
  PaymentTermsService,
  PersonsService,
  ProductsService,
  ReceivableService,
  RoleService,
  TagService,
  VatRatesService,
} from './services';
import { BankAccountsService } from './services/BankAccountsService';

export class ApiService {
  public readonly counterparts: CounterpartsService;
  public readonly currencies: CurrenciesInternalService;
  public readonly counterpartsAddresses: CounterpartsAddressesService;
  public readonly partnerApi: PartnerApiService;
  public readonly auth: AuthService;

  /**
   * `FilesService` is responsible for transport level
   *  managing all files related to the entity
   *
   * @see {@link https://docs.monite.com/reference/get_files} of API documentation
   */
  public readonly files: FilesService;
  public readonly payable: PayablesService;
  /**
   * `PayableLineItemsService` is responsible for transport level
   * managing all line items related to payables.
   *
   * Line item refers to any service or product added to a payable,
   * along with their descriptions, quantities, rates, and prices.
   * Every payable has descriptions of all items purchased.
   *
   * @see {@link https://docs.monite.com/docs/manage-line-items} of an API documentation
   */
  public readonly payableLineItems: PayableLineItemsService;
  public readonly persons: PersonsService;
  public readonly tag: TagService;
  public readonly role: RoleService;

  /**
   * `ReceivableService` is responsible for transport level
   *  managing all account receivables
   *
   * Accounts receivable refers to the money owed to a company
   *  by its clients for products or services that
   *  have been delivered, but not paid for yet.
   *
   * Some of the document types used in accounts receivable are:
   * - Invoice - a request for payment that lists the products or services
   *    that were delivered, and the amount due.
   * - Quote - a formal offer that details how much the products or services
   *    will cost, before the client commits to a purchase.
   * - Credit note - reduces the amount due on an invoice.
   *
   *
   * With Monite API, partners can automate the accounts receivable processes
   *  for SMEs so that they can:
   * - Generate branded invoices, quotes, and credit notes.
   * - Send the documents via email, or generate a PDF.
   * - Have payment reminders sent automatically to the SME's customers.
   * - Track the document status (for example, issued, paid, or expired).
   *
   * @see {@link https://docs.monite.com/docs/ar-overview} of an API documentation
   */
  public readonly receivable: ReceivableService;
  public readonly paymentTerms: PaymentTermsService;
  public readonly products: ProductsService;

  /**
   * `BankAccountsService` is responsible for transport level
   *  managing all bank accounts related to the entity
   *
   * Entities that represent the customers of Monite API partners can have
   *  their bank account information associated with them.
   *  These bank accounts can be set as default for payment
   *  in different currencies.
   *
   * @see {@link https://docs.monite.com/docs/entities-bank-accounts} of API documentation
   */
  public readonly bankAccounts: BankAccountsService;

  /**
   * `ApprovalPoliciesService` is responsible for transport level
   *  managing how to create and customize the approval policies for payables
   *
   * Before a payable is ready to be paid, somebody may be required
   *  to approve the operation. Based on specific conditions
   *  of the payable, certain approval may be required.
   *
   * Monite allows entities to automate and customize this process
   *  using the approval policies. Some examples of approval policies logic:
   *
   * If the payable:
   *  - was received from a specific counterpart (vendor or supplier),
   *  - was uploaded by a specific entity user,
   *  - was uploaded by any user with a specific role,
   *  - is in a specific currency (such as EUR or USD),
   *  - has a specific amount to be paid (for example, ≥ 5000 EUR or 100-500 USD),
   *  - has specific tags assigned to it,
   *  - or any combination of these conditions,
   *
   * then it should be approved by:
   *  - a specific entity user (such as the Finance Manager),
   *  - any user with a specific role,
   *  - any N users from the given list,
   *  - several entity users in a specific order (for example, first by the Team Lead, then by the Finance Manager).
   *
   * @see {@link https://docs.monite.com/docs/approval-policies-overview} of the documentation
   */
  public readonly approvalPolicies: ApprovalPoliciesService;

  public readonly vatRates: VatRatesService;
  public readonly internalSettings: InternalSettingsService;
  public readonly measureUnits: MeasureUnitsService;
  public readonly payment: PaymentService;
  public readonly entityUser: EntityUserService;

  /**
   * `EntityService` is responsible for transport level
   *  managing all entities related to the partner
   *
   * A customer of a partner – an entity – is either an organization
   *  or an individual.
   *
   * Each partner develops for one or more entities.
   * With the ID of an entity is possible to obtain root access to all
   *  resources related to this specific entity only.
   *
   * For example, Beispiel GmbH and Example Inc are both customers
   *  of NeobankA.
   * Tokens issued for Beispiel GmbH only give access
   *  to the resources associated with Beispiel GmbH.
   * Access to Example Inc. is not possible.
   *
   * @see {@link https://docs.monite.com/docs/monite-account-structure#entity} of API documentation
   * @see {@link https://docs.monite.com/docs/entities} of common meaning
   */
  public readonly entity: EntityService;
  public readonly onboarding: OnboardingService;
  public readonly onboardingDocuments: OnboardingDocumentsService;

  constructor(config: OpenAPIConfig) {
    const openApi = new OpenAPI(config);

    this.counterparts = new CounterpartsService(openApi);
    this.currencies = new CurrenciesInternalService(openApi);
    this.bankAccounts = new BankAccountsService(openApi);
    this.counterpartsAddresses = new CounterpartsAddressesService(openApi);
    this.partnerApi = new PartnerApiService(openApi);
    this.auth = new AuthService(openApi);
    this.files = new FilesService(openApi);
    this.receivable = new ReceivableService(openApi);
    this.paymentTerms = new PaymentTermsService(openApi);
    this.products = new ProductsService(openApi);
    this.internalSettings = new InternalSettingsService(openApi);
    this.measureUnits = new MeasureUnitsService(openApi);
    this.vatRates = new VatRatesService(openApi);
    this.payable = new PayablesService(openApi);
    this.payableLineItems = new PayableLineItemsService(openApi);
    this.persons = new PersonsService(openApi);
    this.tag = new TagService(openApi);
    this.role = new RoleService(openApi);
    this.entityUser = new EntityUserService(openApi);
    this.entity = new EntityService(openApi);
    this.onboarding = new OnboardingService(openApi);
    this.onboardingDocuments = new OnboardingDocumentsService(openApi);
    this.payment = new PaymentService(openApi);
    this.approvalPolicies = new ApprovalPoliciesService(openApi);
  }
}
