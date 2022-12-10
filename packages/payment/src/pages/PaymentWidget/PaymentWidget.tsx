import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Appearance, loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTheme } from 'emotion-theming';

import { Card, Theme } from '@team-monite/ui-kit-react';
import {
  YapilyWidget,
  EmptyScreen,
  SelectPaymentMethod,
  StripeWidget,
} from '@team-monite/ui-widgets-react';

import { PaymentsPaymentMethodsEnum } from '@team-monite/sdk-api';

import { ROUTES } from 'consts';

//TODO: add types
type PaymentWidgetProps = {
  paymentData: any;
  linkId: string;
};

let stripePromise: Promise<Stripe | null> | null = null;

const PaymentWidget = ({ paymentData, linkId }: PaymentWidgetProps) => {
  const theme = useTheme<Theme>();

  const { payment_methods, key } = paymentData;

  const { search } = useLocation();
  const navigate = useNavigate();

  const [, setStripePromise] = useState(stripePromise);

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

  useEffect(() => {
    if (stripePromise) {
      return;
    }
    if (key?.publishable) {
      stripePromise = loadStripe(key?.publishable);
    }
    setStripePromise(stripePromise);
  }, [key?.publishable]);

  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: theme.colors.primary,
    },
    rules: {
      '.Label': {
        marginBottom: '8px',
        marginTop: '12px',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '20px',

        fontFamily:
          '"Faktum", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      },
    },
  };
  const options = {
    appearance,
  };

  if (!stripePromise) {
    return null;
  }

  const onChangeMethod = () => navigate(`/${search}`);

  return (
    <Elements options={options} stripe={stripePromise}>
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
              key.secret &&
              key.publishable && (
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
    </Elements>
  );
};

export default PaymentWidget;
