import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, Alert, Box } from '@monite/ui';

// import { toast } from 'ui/toast';
import { useComponentsContext } from '@monite/react-kit';

import * as Styled from './styles';

type CheckoutFormProps = {
  clientSecret: string;
  returnUrl?: string;
  onFinish?: (result: any) => void;
  price: number;
  fee?: number;
  currency: string;
};

export default function CheckoutForm({
  onFinish,
  price,
  fee,
  returnUrl,
  currency,
}: CheckoutFormProps) {
  const { t } = useComponentsContext();

  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const setMessage = (message: string) => {
    // toast(message);
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (onFinish) {
        onFinish({ status: paymentIntent?.status, clientSecret });
      }

      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [onFinish, stripe]);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnUrl || `${window.location.href}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || '');
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  });

  const totalPrice = price + (fee || 0);

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div>
        <PaymentElement />
      </div>
      <Styled.Prices>
        <Styled.PriceRow>
          <div>{t('payment:widget.amount')}</div>
          <div>{formatter.format(price)}</div>
        </Styled.PriceRow>
        {fee ? (
          <Styled.PriceRow>
            <div>{t('payment:widget.fee')}</div>
            <div>{formatter.format(fee)}</div>
          </Styled.PriceRow>
        ) : null}
        <Styled.PriceRow total>
          <div>{t('payment:widget.total')}</div>
          <div>{formatter.format(totalPrice)}</div>
        </Styled.PriceRow>
      </Styled.Prices>
      {fee ? (
        <Box mt="16px">
          <Alert>
            {t('payment:widget.feeAlert', { percent: (fee * 100.0) / price })}
          </Alert>
        </Box>
      ) : null}
      <Button
        mt="24px"
        block
        disabled={isLoading || !stripe || !elements}
        id="submit"
        type="submit"
        isLoading={isLoading}
      >
        <span id="button-text">
          {t('payment:widget.submit')} {formatter.format(totalPrice)}
        </span>
      </Button>
    </form>
  );
}
