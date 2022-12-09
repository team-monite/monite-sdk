import { Elements } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { Appearance, loadStripe, Stripe } from '@stripe/stripe-js';
import { useTheme } from 'emotion-theming';

import { Theme } from '@team-monite/ui-kit-react';
import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';
import NavHeader from '../NavHeader';

import CheckoutForm from './CheckoutForm';

let stripePromise: Promise<Stripe | null> | null = null;

type StripeFormProps = {
  clientSecret: string;
  publishableSecret: string;
  navButton?: boolean;
  paymentData: PaymentsPaymentLinkResponse;
  handleBack: () => void;
  linkId: string;
};

const StripeForm = ({
  clientSecret,
  publishableSecret,
  navButton,
  paymentData,
  handleBack,
  linkId,
}: StripeFormProps) => {
  const theme = useTheme<Theme>();

  const [, setStripePromise] = useState(stripePromise);

  useEffect(() => {
    if (stripePromise) {
      return;
    }
    stripePromise = loadStripe(publishableSecret);
    setStripePromise(stripePromise);
  }, [publishableSecret]);

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
          {navButton && <NavHeader handleBack={handleBack} />}
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm paymentData={paymentData} linkId={linkId} />
          </Elements>
        </>
      )}
    </>
  );
};

export default StripeForm;
