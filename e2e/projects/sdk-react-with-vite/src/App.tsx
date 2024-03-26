import { useState } from 'react';

import { MoniteSDK } from '@monite/sdk-api';
import {
  MoniteProvider,
  Counterparts,
  Payables,
  Tags,
  Receivables,
  Products,
  ApprovalPolicies,
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
        <Payables />
        <Counterparts />
        <Counterparts />
        <Tags />
        <Receivables />
        <Products />
        <ApprovalPolicies />
      </MoniteProvider>
    </div>
  );
}

export default App;
