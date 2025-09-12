import { components } from '@/api';

export type LedgerAccountResponse =
  components['schemas']['LedgerAccountResponse'];

export const getLedgerAccountListResponseMock =
  (): components['schemas']['LedgerAccountListResponse'] => ({
    data: [
      {
        id: 'acc_001',
        name: 'Accounts Receivable',
        type: 'Asset' as const,
        subtype: 'Current Asset',
        description: 'Money owed to the business by customers',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_002',
        name: 'Office Supplies Expense',
        type: 'Expense' as const,
        subtype: 'Operating Expense',
        description: 'Cost of office supplies and materials',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_003',
        name: 'Medical Equipment',
        type: 'Asset' as const,
        subtype: 'Fixed Asset',
        description: 'Veterinary and medical equipment',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_004',
        name: 'Professional Services',
        type: 'Expense' as const,
        subtype: 'Operating Expense',
        description: 'External professional services and consulting',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_005',
        name: 'Pharmaceutical Supplies',
        type: 'Expense' as const,
        subtype: 'Cost of Goods Sold',
        description: 'Medications and pharmaceutical supplies',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_006',
        name: 'Laboratory Services',
        type: 'Expense' as const,
        subtype: 'Operating Expense',
        description: 'External laboratory testing services',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_007',
        name: 'Building Maintenance',
        type: 'Expense' as const,
        subtype: 'Operating Expense',
        description: 'Facility maintenance and repairs',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_008',
        name: 'Insurance Expense',
        type: 'Expense' as const,
        subtype: 'Operating Expense',
        description: 'Business insurance premiums',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_009',
        name: 'Inventory - Medical Supplies',
        type: 'Asset' as const,
        subtype: 'Current Asset',
        description: 'Medical supplies inventory',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_010',
        name: 'Accounts Payable',
        type: 'Liability' as const,
        subtype: 'Current Liability',
        description: 'Money owed to suppliers and vendors',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_011',
        name: 'Utilities Expense',
        type: 'Expense' as const,
        subtype: 'Operating Expense',
        description: 'Electricity, water, gas, and other utilities',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
      {
        id: 'acc_012',
        name: 'Training and Education',
        type: 'Expense' as const,
        subtype: 'Operating Expense',
        description: 'Staff training and continuing education',
        currency: 'USD' as const,
        is_bank_account: false,
        status: 'active' as const,
      },
    ],
    prev_pagination_token: undefined,
    next_pagination_token: undefined,
  });

export const getLedgerAccountResponseMock = (
  id: string
): components['schemas']['LedgerAccountResponse'] => {
  const allAccounts = getLedgerAccountListResponseMock().data;
  const account = allAccounts.find((acc) => acc.id === id);

  if (!account) {
    throw new Error(`Ledger account with id ${id} not found in mock data`);
  }

  return account;
};
