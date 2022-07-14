import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from '@monite/ui';
import styled from '@emotion/styled';

import StripeForm from './StripeForm';
import YapilyForm from './YapilyForm';

import type { PaymentWidgetProps } from './types';

const Wrapper = styled.div`
  font-family: 'Faktum', sans-serif;

  * {
    box-sizing: border-box;
  }
`;

const PaymentWidget = (props: PaymentWidgetProps) => {
  const [stripeClientSecret] = useState(
    // TODO: fetch clientSecret from the API endpoint WHEN it will be ready
    'pi_3LKHgzCq0HpJYRYN0EOoxirg_secret_weXEYslETkqL1D8sQsJqUKHnS'
  );

  useEffect(() => {
    // TODO: fetch clientSecret from the API endpoint WHEN it will be ready
    // Create PaymentIntent as soon as the page loads
    // (async () => {
    //   const res = await rootStore.monite?.api.payments.initPayment({});
    //
    //   setClientSecret(res.clientSecret)
    // })();
  }, []);

  return (
    <Wrapper>
      <Tabs>
        <TabList>
          <Tab>Stripe</Tab>
          <Tab>Yapily</Tab>
        </TabList>

        <TabPanel forceRender>
          {stripeClientSecret && (
            <StripeForm clientSecret={stripeClientSecret} {...props} />
          )}
        </TabPanel>
        <TabPanel>
          <YapilyForm {...props} />
        </TabPanel>
      </Tabs>
    </Wrapper>
  );
};

export default PaymentWidget;
