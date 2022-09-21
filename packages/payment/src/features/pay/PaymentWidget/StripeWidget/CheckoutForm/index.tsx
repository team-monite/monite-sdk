import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, Alert, Box } from '@monite/ui-kit-react';
import { PaymentMethodsEnum } from '@monite/sdk-api';

import { useComponentsContext, toast } from '@monite/ui-widgets-react';

import * as Styled from './styles';

type CheckoutFormProps = {
  clientSecret: string;
  returnUrl?: string;
  onFinish?: (result: any) => void;
  price: number;
  fee?: number;
  currency: string;
  paymentLinkId: string;
};

export default function CheckoutForm({
  onFinish,
  price,
  returnUrl,
  currency,
  paymentLinkId,
  clientSecret,
}: CheckoutFormProps) {
  const { t, monite } = useComponentsContext();

  const stripe = useStripe();
  const elements = useElements();

  const { search } = useLocation();

  const rawPaymentData = new URLSearchParams(search).get('data');

  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('');

  const setMessage = (message: string) => {
    toast(message);
  };

  useEffect(
    function () {
      elements?.getElement('payment')?.focus();
    },
    [elements]
  );

  useEffect(() => {
    if (!stripe) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (onFinish) {
        onFinish({ status: paymentIntent?.status });
      }
    });
  }, [clientSecret, onFinish, stripe]);

  const handleChangeFee = async (paymentMethod: PaymentMethodsEnum) => {
    monite.api.payment
      .getFeeByPaymentMethod(paymentMethod, {
        payment_link_id: paymentLinkId,
      })
      .then((response) => {
        setFee(response.total.fee);
        setTotalAmount(response.total.amount);
      });
  };

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    try {
      if (paymentMethod !== PaymentMethodsEnum.CARD) {
        await monite.api.payment.payByPaymentLinkId(paymentLinkId, {
          payment_method: paymentMethod,
        });
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:
            `${window.location.origin}/result?data=${rawPaymentData}` ||
            `${window.location.href}`,
        },
      });
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (
        error.type === 'card_error' ||
        error.type === 'validation_error' ||
        error.type === 'invalid_request_error'
      ) {
        setMessage(error.message || '');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } catch (e: any) {
      setMessage('An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  });

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div>
        <PaymentElement
          onChange={(value) => {
            setPaymentMethod(value.value.type as PaymentMethodsEnum);
            handleChangeFee(value.value.type as PaymentMethodsEnum);
          }}
        />
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
          <div>{formatter.format(totalAmount)}</div>
        </Styled.PriceRow>
      </Styled.Prices>
      {fee ? (
        <Box mt="16px">
          <Alert>
            {t('payment:widget.feeAlert', {
              percent: ((fee * 100.0) / price).toFixed(2),
            })}
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
          {t('payment:widget.submit')} {formatter.format(totalAmount)}
        </span>
      </Button>
    </form>
  );
}
