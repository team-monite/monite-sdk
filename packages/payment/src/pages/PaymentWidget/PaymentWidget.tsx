import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Card } from '@team-monite/ui-kit-react';
import {
  YapilyWidget,
  EmptyScreen,
  SelectPaymentMethod,
  StripeWidget,
} from '@team-monite/ui-widgets-react';

import {
  PaymentsPaymentMethodsEnum,
  PaymentIntentWithSecrets,
} from '@team-monite/sdk-api';

import { ROUTES } from 'consts';

//TODO: add types
type PaymentWidgetProps = {
  paymentData: PaymentIntentWithSecrets;
  linkId: string;
};

const PaymentWidget = ({ paymentData, linkId }: PaymentWidgetProps) => {
  const { payment_methods, key } = paymentData;

  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      payment_methods?.length === 1 &&
      payment_methods?.[0] === PaymentsPaymentMethodsEnum.SEPA_CREDIT
    ) {
      navigate(`${ROUTES.bank}${search}`, { replace: true });
    } else if (
      payment_methods?.length > 0 &&
      !payment_methods.includes(PaymentsPaymentMethodsEnum.SEPA_CREDIT)
    ) {
      navigate(`${ROUTES.checkout}${search}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [navigate, search]);

  const onChangeMethod = () => navigate(`/${search}`);

  return (
    <Card shadow p={[16, 32]}>
      <Routes>
        <Route
          path="/"
          element={
            payment_methods?.length ? (
              <SelectPaymentMethod paymentMethods={payment_methods} />
            ) : (
              <EmptyScreen />
            )
          }
        />
        <Route
          path={ROUTES.checkout}
          element={
            key?.secret &&
            key?.publishable && (
              <StripeWidget
                clientSecret={key.secret}
                publishableSecret={key.publishable}
                navButton={payment_methods?.includes(
                  PaymentsPaymentMethodsEnum.SEPA_CREDIT
                )}
                paymentData={paymentData}
                handleBack={onChangeMethod}
                linkId={linkId}
              />
            )
          }
        />
        <Route
          path={ROUTES.bank}
          element={
            <YapilyWidget
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
