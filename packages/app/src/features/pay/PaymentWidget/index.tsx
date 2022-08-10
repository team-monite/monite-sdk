import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { ReceivableResponse, CurrencyEnum } from '@monite/js-sdk';
import { useComponentsContext } from '@monite/react-kit';
import { Card } from '@monite/ui';

import StripeWidget from './StripeWidget';
import YapilyWidget from './YapilyWidget';
import SelectPaymentMethod from './SelectPaymentMethod';

import { PaymentProvidersEnum, URLData } from '../types';

import styles from './styles.module.scss';

type PaymentWidgetProps = {
  paymentData: URLData;
  fee?: number;
  currency?: CurrencyEnum;
  onFinish?: (result: any) => void;
  returnUrl?: string;
  stripeEnabled?: boolean;
};

const PaymentWidget = (props: PaymentWidgetProps) => {
  const [receivableData, setReceivableData] = useState<ReceivableResponse>();

  const { paymentData } = props;
  const {
    object: { id },
    providers,
    paymentMethods = ['card', 'others'], // TODO: mockData
  } = paymentData;

  const stripeClientSecret = providers.find(
    (provider) => provider.type === PaymentProvidersEnum.STRIPE
  )?.secret;

  // const yapilyClientSecret = providers.find(
  //   (provider) => provider.type === PaymentProvidersEnum.YAPILY
  // )?.secret;

  const { search } = useLocation();

  const navigate = useNavigate();

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const receivableData = await monite.api.payment.getPaymentReceivableById(
        id
      );
      setReceivableData(receivableData);
    })();
    if (paymentMethods.length === 1 && paymentMethods[0] === 'card') {
      navigate(`card${search}`, { replace: true });
    } else if (paymentMethods.length === 1 && paymentMethods[0] === 'bank') {
      navigate(`bank${search}`, { replace: true });
    }
  }, []);

  return (
    <Card shadow p="32px" className={styles.card}>
      <Routes>
        <Route
          path="/"
          element={<SelectPaymentMethod paymentMethods={paymentMethods} />}
        />
        <Route
          path={'card/*'}
          element={
            stripeClientSecret &&
            receivableData?.total_amount && (
              <StripeWidget
                clientSecret={stripeClientSecret}
                {...props}
                price={receivableData?.total_amount}
                fee={300}
                navButton={paymentMethods.length > 1}
              />
            )
          }
        />
        <Route
          path={'bank/*'}
          element={<YapilyWidget {...props} receivableData={receivableData} />}
        />
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
