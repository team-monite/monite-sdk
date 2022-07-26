import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from '@monite/ui';
import { ReceivableResponse } from '@monite/js-sdk';
import styled from '@emotion/styled';

import { useComponentsContext } from 'core/context/ComponentsContext';

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
  const [receivableData, setReceivableData] = useState<ReceivableResponse>();

  const { id, stripeClientSecret } = props;

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const receivableData = await monite.api.payment.getPaymentReceivableById(
        id
      );
      setReceivableData(receivableData);
    })();
  }, []);

  return (
    <Wrapper>
      <Tabs>
        <TabList>
          <Tab>Stripe</Tab>
          <Tab>Yapily</Tab>
        </TabList>

        <TabPanel forceRender>
          {stripeClientSecret && receivableData?.total_amount && (
            <StripeForm
              clientSecret={stripeClientSecret}
              {...props}
              price={receivableData?.total_amount}
            />
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
