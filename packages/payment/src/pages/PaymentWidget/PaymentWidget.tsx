import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { CurrencyEnum, PaymentsPaymentMethodsEnum } from '@team-monite/sdk-api';
import { Card } from '@team-monite/ui-kit-react';
import {
  YapilyWidget,
  EmptyScreen,
  SelectPaymentMethod,
} from '@team-monite/ui-widgets-react';
import {
  PaymentsPaymentLinkResponse,
  PaymentsPaymentsPaymentIntent,
} from '@team-monite/sdk-api';

import StripeWidget from './StripeWidget';

import { ROUTES } from 'consts';

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
      navigate(`${ROUTES.card}${search}`, { replace: true });
    } else if (
      paymentMethods?.length === 1 &&
      paymentMethods?.[0] === PaymentsPaymentMethodsEnum.SEPA_CREDIT
    ) {
      navigate(`${ROUTES.bank}${search}`, { replace: true });
    } else if (
      paymentMethods?.length > 0 &&
      !paymentMethods.includes(PaymentsPaymentMethodsEnum.CARD) &&
      !paymentMethods.includes(PaymentsPaymentMethodsEnum.SEPA_CREDIT)
    ) {
      navigate(`${ROUTES.other}${search}`, { replace: true });
    }
    // TODO enable linter
    // eslint-disable-next-line
  }, []);

  const onChangeMethod = () => navigate(`/${search}`);

  return (
    <Card shadow p={32}>
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
                handleBack={onChangeMethod}
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
                handleBack={onChangeMethod}
              />
            )
          }
        />
        <Route
          path={ROUTES.bank}
          element={
            <YapilyWidget
              {...props}
              paymentData={paymentData}
              onChangeMethod={onChangeMethod}
            />
          }
        />
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
