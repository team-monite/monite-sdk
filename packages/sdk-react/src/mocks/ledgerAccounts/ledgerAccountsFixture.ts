import { components } from '@/api';
import { faker } from '@faker-js/faker';

export type LedgerAccountResponse =
  components['schemas']['LedgerAccountResponse'];

let cachedAccounts: LedgerAccountResponse[] | null = null;

function getOrCreateAccounts(): LedgerAccountResponse[] {
  if (cachedAccounts) return cachedAccounts;

  cachedAccounts = [
    {
      id: faker.string.uuid(),
      name: 'Accounts Receivable',
      type: 'Asset' as const,
      subtype: 'Current',
      nominal_code: '1100',
      description: 'Money owed to the business by customers',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Office Supplies Expense',
      type: 'Expense' as const,
      subtype: 'Operating',
      nominal_code: '6100',
      description: 'Cost of office supplies and materials',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Medical Equipment',
      type: 'Asset' as const,
      subtype: 'Fixed',
      nominal_code: '1500',
      description: 'Veterinary and medical equipment',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Professional Services',
      type: 'Expense' as const,
      subtype: 'Operating',
      nominal_code: '6200',
      description: 'External professional services and consulting',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Pharmaceutical Supplies',
      type: 'Expense' as const,
      subtype: 'COGS',
      nominal_code: '5000',
      description: 'Medications and pharmaceutical supplies',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Laboratory Services',
      type: 'Expense' as const,
      subtype: 'Operating',
      nominal_code: '6300',
      description: 'External laboratory testing services',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Building Maintenance',
      type: 'Expense' as const,
      subtype: 'Operating',
      nominal_code: '6400',
      description: 'Facility maintenance and repairs',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Insurance Expense',
      type: 'Expense' as const,
      subtype: 'Operating',
      nominal_code: '6500',
      description: 'Business insurance premiums',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Inventory - Medical Supplies',
      type: 'Asset' as const,
      subtype: 'Current',
      nominal_code: '1200',
      description: 'Medical supplies inventory',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Accounts Payable',
      type: 'Liability' as const,
      subtype: 'Current',
      nominal_code: '2100',
      description: 'Money owed to suppliers and vendors',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Utilities Expense',
      type: 'Expense' as const,
      subtype: 'Operating',
      nominal_code: '6600',
      description: 'Electricity, water, gas, and other utilities',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
    {
      id: faker.string.uuid(),
      name: 'Training and Education',
      type: 'Expense' as const,
      subtype: 'Operating',
      nominal_code: '6700',
      description: 'Staff training and continuing education',
      currency: 'USD' as const,
      is_bank_account: false,
      status: 'active' as const,
    },
  ];

  return cachedAccounts;
}

export const getLedgerAccountListResponseMock =
  (): components['schemas']['LedgerAccountListResponse'] => ({
    data: getOrCreateAccounts(),
    prev_pagination_token: undefined,
    next_pagination_token: undefined,
  });

export const getLedgerAccountResponseMock = (
  id: string
): components['schemas']['LedgerAccountResponse'] => {
  const allAccounts = getOrCreateAccounts();
  const account = allAccounts.find((acc) => acc.id === id);

  if (!account) {
    throw new Error(`Ledger account with id ${id} not found in mock data`);
  }

  return account;
};
