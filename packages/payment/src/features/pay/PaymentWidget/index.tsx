import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { CurrencyEnum, PaymentsPaymentMethodsEnum } from '@team-monite/sdk-api';
import { Card } from '@team-monite/ui-kit-react';

import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';

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
  stripeEnabled?: boolean;
};

const PaymentWidget = (props: PaymentWidgetProps) => {
  const { paymentData } = props;
  const paymentMethods = paymentData?.payment_methods || [];

  const stripeCardData = paymentData?.payment_intents?.find(
    (elem) => elem.provider === 'stripe' && elem.payment_method.includes('card')
  );

  const stripeOthersData = paymentData?.payment_intents?.find(
    (elem) =>
      elem.provider === 'stripe' && elem.payment_method.includes('others')
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
    // eslint-disable-next-line
  }, []);

  return (
    <Card shadow p="32px" className={styles.card}>
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
                price={paymentData?.amount}
                currency={paymentData?.currency}
                navButton={paymentMethods?.length > 1}
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
                navButton={paymentMethods?.length > 1}
                paymentLinkId={paymentData?.id}
                returnUrl={paymentData?.return_url}
                onFinish={props.onFinish}
              />
            )
          }
        />
        <Route
          path={ROUTES.bank}
          //@ts-ignore
          element={<YapilyWidget {...props} paymentData={paymentData} />}
        />
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
