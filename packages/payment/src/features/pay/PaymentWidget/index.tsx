import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { ReceivableResponse, CurrencyEnum } from '@monite/js-sdk';
import { useComponentsContext } from '@monite/react-kit';
import { Card } from '@monite/ui';

import { ROUTES } from 'features/app/consts';
import StripeWidget from './StripeWidget';
import YapilyWidget from './YapilyWidget';
import SelectPaymentMethod from './SelectPaymentMethod';
import EmptyScreen from 'features/pay/EmptyScreen';

import { URLData } from '../types';

import styles from './styles.module.scss';

type PaymentWidgetProps = {
  paymentData?: URLData;
  fee?: number;
  currency?: CurrencyEnum;
  onFinish?: (result: any) => void;
  returnUrl?: string;
  stripeEnabled?: boolean;
};

const PaymentWidget = (props: PaymentWidgetProps) => {
  const [receivableData, setReceivableData] = useState<ReceivableResponse>();

  const { paymentData } = props;

  const { search } = useLocation();

  const navigate = useNavigate();

  const { monite } = useComponentsContext() || {};
  useEffect(() => {
    (async () => {
      if (paymentData?.object.id) {
        const receivableData =
          await monite.api.payment.getPaymentReceivableById(
            paymentData?.object.id
          );
        setReceivableData(receivableData);
      }
    })();
    if (
      paymentData?.payment_methods?.length === 1 &&
      paymentData?.payment_methods?.[0] === 'card'
    ) {
      navigate(`card${search}`, { replace: true });
    } else if (
      paymentData?.payment_methods?.length === 1 &&
      paymentData?.payment_methods?.[0] === 'bank'
    ) {
      navigate(`bank${search}`, { replace: true });
    }
  }, [
    paymentData?.object.id,
    monite.api.payment,
    navigate,
    search,
    paymentData?.payment_methods,
  ]);

  return (
    <Card shadow p="32px" className={styles.card}>
      <Routes>
        <Route
          path="/"
          element={
            paymentData && paymentData?.payment_methods?.length ? (
              <SelectPaymentMethod
                paymentMethods={
                  paymentData?.payment_methods || ['card', 'others', 'bank']
                }
              />
            ) : (
              <EmptyScreen />
            )
          }
        />
        <Route
          path={ROUTES.card}
          element={
            paymentData?.stripe?.secret && (
              <StripeWidget
                clientSecret={paymentData?.stripe.secret}
                {...props}
                price={paymentData?.amount}
                currency={paymentData?.currency}
                fee={300}
                navButton={paymentData?.payment_methods?.length > 1}
              />
            )
          }
        />
        <Route
          path={ROUTES.bank}
          element={<YapilyWidget {...props} receivableData={receivableData} />}
        />
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
