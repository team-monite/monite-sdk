import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { Button, Alert, Box } from '@team-monite/ui-kit-react';
import {
  MoniteAllPaymentMethodsTypes,
  PaymentIntentWithSecrets,
  PaidBy,
} from '@team-monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';
import { useFeeByPaymentMethod } from 'core/queries/usePayment';
import { getReadableAmount } from 'core/utils';

import * as Styled from './styles';

type CheckoutFormProps = {
  paymentIntent: PaymentIntentWithSecrets;
  linkId: string;
};

export default function CheckoutForm({ paymentIntent }: CheckoutFormProps) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();

  const { search } = useLocation();

  const rawPaymentData = new URLSearchParams(search).get('data');

  const [isLoading, setIsLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<MoniteAllPaymentMethodsTypes>();

  const { amount, currency, id } = paymentIntent;

  const setMessage = (message: string) => {
    toast(message);
  };

  useEffect(
    function () {
      elements?.getElement('payment')?.focus();
    },
    [elements]
  );

  const { data: feeData } = useFeeByPaymentMethod(paymentMethod, id);
  const fee = feeData?.total.fee;
  const totalAmount = feeData?.total.amount || 0;

  const { monite } = useComponentsContext();

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // extra call because of this https://gemms.atlassian.net/browse/DEV-4711
    const calculateFeeResponse = await monite.api.payment.getFeeByPaymentMethod(
      id,
      {
        payment_method: paymentMethod,
      }
    );

    if (calculateFeeResponse) {
      try {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url:
              `${window.location.origin}/result?data=${rawPaymentData}&payment_method=${paymentMethod}` ||
              `${window.location.href}`,
          },
        });
        if (error) {
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
        }
      } catch (e) {
        setMessage('An unexpected error occurred.');
      }
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div>
        <PaymentElement
          onChange={(e) => {
            setPaymentMethod(e.value.type as MoniteAllPaymentMethodsTypes);
          }}
        />
      </div>
      <Styled.Prices>
        {feeData?.paid_by === PaidBy.PAYER && (
          <Styled.PriceRow>
            <div>{t('payment:widget.amount')}</div>
            {fee && <div>{getReadableAmount(amount, currency)}</div>}
          </Styled.PriceRow>
        )}
        {feeData?.paid_by === PaidBy.PAYER ? (
          <Styled.PriceRow>
            <div>{t('payment:widget.fee')}</div>
            {fee && <div>{getReadableAmount(fee, currency)}</div>}
          </Styled.PriceRow>
        ) : null}
        <Styled.PriceRow total>
          <div>{t('payment:widget.total')}</div>
          {fee && <div>{getReadableAmount(totalAmount, currency)}</div>}
        </Styled.PriceRow>
      </Styled.Prices>
      {fee && feeData?.paid_by === PaidBy.PAYER ? (
        <Box mt="16px">
          <Alert>
            {t('payment:widget.feeAlert', {
              percent: ((fee * 100.0) / amount).toFixed(2),
            })}
          </Alert>
        </Box>
      ) : null}
      <Button
        mt="24px"
        block
        disabled={isLoading || !stripe || !elements}
        isLoading={isLoading}
        onClick={handleSubmit}
      >
        <span id="button-text">
          {t('payment:widget.submit')}{' '}
          {!!totalAmount && getReadableAmount(totalAmount, currency)}
        </span>
      </Button>
    </div>
  );
}
