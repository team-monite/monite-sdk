import { Elements } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { Appearance, loadStripe, Stripe } from '@stripe/stripe-js';
import { useTheme } from 'emotion-theming';
import { Theme } from '@team-monite/ui-kit-react';
import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';
import { NavHeader } from '@team-monite/ui-widgets-react';

import CheckoutForm from './CheckoutForm';

let stripePromise: Promise<Stripe | null> | null = null;

type StripeFormProps = {
  clientSecret: string;
  navButton?: boolean;
  paymentData: PaymentsPaymentLinkResponse;
};

const StripeForm = ({
  clientSecret,
  navButton,
  paymentData,
}: StripeFormProps) => {
  const theme = useTheme<Theme>();

  const [, setStripePromise] = useState(stripePromise);

  useEffect(() => {
    if (stripePromise) {
      return;
    }

    stripePromise = loadStripe(
      // TODO: change it to key from backend
      'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE'
    );

    setStripePromise(stripePromise);
  }, []);

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
    clientSecret,
    appearance,
  };

  if (!stripePromise) {
    return null;
  }

  return (
    <>
      {clientSecret && (
        <>
          {navButton && <NavHeader />}
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm paymentData={paymentData} />
          </Elements>
        </>
      )}
    </>
  );
};

export default StripeForm;
