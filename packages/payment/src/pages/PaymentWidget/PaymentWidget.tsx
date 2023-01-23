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
  MoniteAllPaymentMethodsTypes,
  PaymentIntentWithSecrets,
} from '@team-monite/sdk-api';

import { ROUTES } from 'consts';

type PaymentWidgetProps = {
  paymentIntent: PaymentIntentWithSecrets;
  linkId: string;
};

const PaymentWidget = ({ paymentIntent, linkId }: PaymentWidgetProps) => {
  const { payment_methods, key } = paymentIntent;

  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      payment_methods?.length === 1 &&
      payment_methods?.[0] === MoniteAllPaymentMethodsTypes.SEPA_CREDIT
    ) {
      navigate(`${ROUTES.bank}${search}`, { replace: true });
    } else if (
      payment_methods?.length > 0 &&
      !payment_methods.includes(MoniteAllPaymentMethodsTypes.SEPA_CREDIT)
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
                  MoniteAllPaymentMethodsTypes.SEPA_CREDIT
                )}
                paymentIntent={paymentIntent}
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
              paymentIntent={paymentIntent}
              onChangeMethod={onChangeMethod}
              onAuthorizePayment={(url: string) => window.location.replace(url)}
            />
          }
        />
      </Routes>
    </Card>
  );
};

export default PaymentWidget;
