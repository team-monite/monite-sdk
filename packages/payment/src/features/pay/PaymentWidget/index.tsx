import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { ReceivableResponse, CurrencyEnum } from '@monite/js-sdk';
import { useComponentsContext } from '@monite/react-kit';
import { Card } from '@monite/ui';

import StripeWidget from './StripeWidget';
import YapilyWidget from './YapilyWidget';
import SelectPaymentMethod from './SelectPaymentMethod';

import { URLData } from '../types';

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
    stripe,
    payment_methods = ['card', 'others', 'bank'], // TODO: mockData
    // payment_intent_id,
    amount,
    currency,
    // success_url,
    // cancel_url,
  } = paymentData;

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
    if (payment_methods.length === 1 && payment_methods[0] === 'card') {
      navigate(`card${search}`, { replace: true });
    } else if (payment_methods.length === 1 && payment_methods[0] === 'bank') {
      navigate(`bank${search}`, { replace: true });
    }
  }, [id, monite.api.payment, navigate, payment_methods, search]);

  return (
    <Card shadow p="32px" className={styles.card}>
      <Routes>
        <Route
          path="/"
          element={<SelectPaymentMethod paymentMethods={payment_methods} />}
        />
        <Route
          path={'card/*'}
          element={
            stripe?.secret && (
              <StripeWidget
                clientSecret={stripe.secret}
                {...props}
                price={amount}
                currency={currency}
                fee={300}
                navButton={payment_methods.length > 1}
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
