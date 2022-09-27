import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { CurrencyEnum } from '@monite/sdk-api';
import { Card } from '@monite/ui-kit-react';

import { PaymentsPaymentLinkResponse } from '@monite/sdk-api';

import StripeWidget from './StripeWidget';
// import YapilyWidget from './YapilyWidget';
import SelectPaymentMethod from './SelectPaymentMethod';
import EmptyScreen from 'features/pay/EmptyScreen';

import { ROUTES } from 'features/app/consts';

import styles from './styles.module.scss';

type PaymentWidgetProps = {
  paymentData: PaymentsPaymentLinkResponse;
  fee?: number;
  currency?: CurrencyEnum;
  onFinish?: (result: any) => void;
  returnUrl?: string;
  stripeEnabled?: boolean;
};

const PaymentWidget = (props: PaymentWidgetProps) => {
  const { paymentData } = props;

  const stripeCardData = paymentData?.payment_intents?.find(
    (elem) => elem.provider === 'stripe' && elem.payment_method.includes('card')
  );

  const stripeOthersData = paymentData?.payment_intents?.find(
    (elem) =>
      elem.provider === 'stripe' && elem.payment_method.includes('others')
  );

  return (
    <Card shadow p="32px" className={styles.card}>
      <Routes>
        <Route
          path="/"
          element={
            paymentData && paymentData?.payment_methods?.length ? (
              <SelectPaymentMethod
                paymentMethods={paymentData?.payment_methods}
              />
            ) : (
              <EmptyScreen />
            )
          }
        />
        <Route
          path={ROUTES.card}
          element={
            stripeCardData?.key.secret && (
              <StripeWidget
                clientSecret={stripeCardData?.key.secret}
                {...props}
                price={paymentData?.amount}
                currency={paymentData?.currency}
                navButton={paymentData?.payment_methods?.length > 1}
                paymentLinkId={paymentData?.id}
                returnUrl={paymentData?.return_url}
              />
            )
          }
        />
        <Route
          path={ROUTES.other}
          element={
            stripeOthersData?.key.secret && (
              <StripeWidget
                clientSecret={stripeOthersData?.key.secret}
                {...props}
                price={paymentData?.amount}
                currency={paymentData?.currency}
                navButton={paymentData?.payment_methods?.length > 1}
                paymentLinkId={paymentData?.id}
                returnUrl={paymentData?.return_url}
                onFinish={props.onFinish}
              />
            )
          }
        />
        {/* <Route
          path={ROUTES.bank}
          element={<YapilyWidget {...props} paymentData={paymentData} />}
        /> */}
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
