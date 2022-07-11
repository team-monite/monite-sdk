import React, { useEffect, useState } from 'react';
import { CurrencyEnum } from '@monite/js-sdk';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTheme } from 'emotion-theming';
import { Theme } from '@monite/ui';

import CheckoutForm from './CheckoutForm';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  // TODO: make it as ENV variable?
  'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE'
);

type PaymentWidgetProps = {
  price: number;
  fee?: number;
  currency?: CurrencyEnum;
  onFinish?: (result: any) => void;
  returnUrl?: string;
};

const PaymentWidget = ({
  returnUrl,
  onFinish,
  price,
  fee,
}: PaymentWidgetProps) => {
  const theme = useTheme<Theme>();

  const [clientSecret] = useState(
    // TODO: fetch clientSecret from the API endpoint WHEN it will be ready
    'pi_3LKHgzCq0HpJYRYN0EOoxirg_secret_weXEYslETkqL1D8sQsJqUKHnS'
  );

  useEffect(() => {
    // TODO: fetch clientSecret from the API endpoint WHEN it will be ready
    // Create PaymentIntent as soon as the page loads
    // (async () => {
    //   const res = await rootStore.monite?.api.payments.initPayment({});
    //
    //   setClientSecret(res.clientSecret)
    // })();
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

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            returnUrl={returnUrl}
            onFinish={onFinish}
            price={price}
            fee={fee}
          />
        </Elements>
      )}
    </>
  );
};

export default PaymentWidget;
