import { useState } from 'react';

import { MoniteSDK } from '@monite/sdk-api';
import {
  ApprovalPolicies,
  ApprovalPoliciesTable,
  ApprovalPolicyDetails,
  type ApprovalPolicyDetailsProps,
  CounterpartDetails,
  Counterparts,
  CounterpartsTable,
  CreditNotesTable,
  InvoicesTable,
  type InvoicesTableProps,
  type ProductDetailsProps,
  type ProductTableProps,
  MoniteProvider,
  PayableDetails,
  Payables,
  type PayablesDetailsProps,
  type PayablesProps,
  ProductDetails,
  Products,
  ProductsTable,
  QuotesTable,
  Receivables,
  type ReceivablesTableProps,
  Tags,
  TagsTable,
  InvoiceDetails,
  Onboarding,
} from '@monite/sdk-react';

function App() {
  const [monite] = useState(
    () =>
      new MoniteSDK({
        entityId: '05668b7a-...-...-...-...',
        apiUrl: 'https://api.dev.monite.com/v1',
        fetchToken: async () => {
          return Promise.reject('Not implemented');
        },
      })
  );

  return (
    <div className="components-wrapper">
      <MoniteProvider monite={monite}>
        <Payables {...({} satisfies PayablesProps)} />
        <PayableDetails {...({} satisfies PayablesDetailsProps)} />
        <Counterparts />
        <CounterpartsTable />
        <CounterpartDetails id={'fake_id'} />
        <Tags />
        <TagsTable />
        <Receivables {...({} satisfies ReceivablesTableProps)} />
        <InvoicesTable {...({} satisfies InvoicesTableProps)} />
        <InvoiceDetails id={'fake-id'} />
        <QuotesTable />
        <CreditNotesTable />
        <Products />
        <ProductDetails {...({} satisfies ProductDetailsProps)} />
        <ProductsTable {...({} satisfies ProductTableProps)} />
        <ApprovalPolicies />
        <ApprovalPolicyDetails {...({} satisfies ApprovalPolicyDetailsProps)} />
        <ApprovalPoliciesTable />
        <Onboarding />
      </MoniteProvider>
    </div>
  );
}

export default App;
