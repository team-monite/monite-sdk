import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { CurrencyEnum, PaymentsPaymentMethodsEnum } from '@team-monite/sdk-api';
import { Card } from '@team-monite/ui-kit-react';

import {
  PaymentsPaymentLinkResponse,
  PaymentsPaymentsPaymentIntent,
} from '@team-monite/sdk-api';

import StripeWidget from './StripeWidget';
import YapilyWidget from './YapilyWidget';
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
};

const PaymentWidget = (props: PaymentWidgetProps) => {
  const { paymentData } = props;
  const paymentMethods = paymentData?.payment_methods || [];
  const paymentIntents = paymentData?.payment_intents || [];

  const stripeCardData = paymentIntents?.find(
    (intent: PaymentsPaymentsPaymentIntent) =>
      intent.provider === 'stripe' &&
      intent.payment_method.includes(PaymentsPaymentMethodsEnum.CARD)
  );

  const stripeOthersData = paymentIntents?.find(
    (intent: PaymentsPaymentsPaymentIntent) =>
      intent.provider === 'stripe' &&
      !intent.payment_method.includes(PaymentsPaymentMethodsEnum.CARD)
  );

  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      paymentMethods?.length === 1 &&
      paymentMethods?.[0] === PaymentsPaymentMethodsEnum.CARD
    ) {
      navigate(`card${search}`, { replace: true });
    } else if (
      paymentMethods?.length === 1 &&
      paymentMethods?.[0] === PaymentsPaymentMethodsEnum.SEPA_CREDIT
    ) {
      navigate(`bank${search}`, { replace: true });
    } else if (
      paymentMethods?.length > 0 &&
      !paymentMethods.includes(PaymentsPaymentMethodsEnum.CARD) &&
      !paymentMethods.includes(PaymentsPaymentMethodsEnum.SEPA_CREDIT)
    ) {
      navigate(`other${search}`, { replace: true });
    }
    // TODO enable linter
    // eslint-disable-next-line
  }, []);

  return (
    // TODO use emotion
    <Card shadow p={32} className={styles.card}>
      <Routes>
        <Route
          path="/"
          element={
            paymentData && paymentMethods?.length ? (
              <SelectPaymentMethod paymentMethods={paymentMethods} />
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
                navButton={paymentMethods?.length > 1}
                paymentData={paymentData}
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
                navButton={paymentMethods?.length > 1}
                paymentData={paymentData}
              />
            )
          }
        />
        <Route
          path={ROUTES.bank}
          // TODO How it works? :-)
          // if I understand correctly YapilyWidget expects receivableData instead of paymentData
          //@ts-ignore
          element={<YapilyWidget {...props} paymentData={paymentData} />}
        />
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
