import { ReactNode, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'emotion-theming';
import { useStripe } from '@stripe/react-stripe-js';
import {
  Theme,
  UCheckSquare,
  UClockThree,
  UExclamationTriangle,
} from '@team-monite/ui-kit-react';
import { useComponentsContext } from '@team-monite/ui-widgets-react';
import { InternalPaymentLinkResponse } from '@team-monite/sdk-api';

import { fromBase64 } from 'helpers';

import { URLData } from '../types';

enum StripeResultStatuses {
  // RequiresPaymentMethod = 'requires_payment_method',
  // RequiresConfirmation = 'requires_confirmation',
  // RequiresAction = 'requires_action',
  Processing = 'processing',
  RequiresCapture = 'requires_capture',
  Canceled = 'canceled',
  Succeeded = 'succeeded',
  PaymentCancelled = 'payment_cancelled',
  PaymentFailed = 'payment_failed',
}

enum ResultStatuses {
  Processing = 'processing',
  Canceled = 'canceled',
  Succeeded = 'succeeded',
  Error = 'error',
}

export default function usePaymentResult() {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const { search } = useLocation();

  const urlParams = new URLSearchParams(search);

  const rawPaymentData = urlParams.get('data');

  const clientSecret = urlParams.get('payment_intent_client_secret');

  const yapilyConsent = urlParams.get('consent');

  const stripe = useStripe();
  const linkData = useMemo(() => {
    if (rawPaymentData) {
      return fromBase64(rawPaymentData) as URLData;
    }
  }, [rawPaymentData]);

  const [paymentData, setPaymentData] = useState<InternalPaymentLinkResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>();

  const { monite } = useComponentsContext() || {};

  const getStatus = (status: string) => {
    switch (status) {
      case StripeResultStatuses.Processing:
      case StripeResultStatuses.RequiresCapture:
        return ResultStatuses.Processing;
      case StripeResultStatuses.Canceled:
      case StripeResultStatuses.PaymentCancelled:
      case StripeResultStatuses.PaymentFailed:
        return ResultStatuses.Canceled;
      case StripeResultStatuses.Succeeded:
        return ResultStatuses.Succeeded;
      default:
        return ResultStatuses.Error;
    }
  };

  useEffect(() => {
    (async () => {
      if (linkData?.id) {
        const data = await monite.api.payment.getPaymentLinkById(linkData.id);
        setPaymentData(data);
        if (data?.payment_intent.status !== 'created') {
          setPaymentStatus(getStatus(data?.payment_intent.status));
        } else if (
          data?.payment_intent.status === 'created' &&
          clientSecret &&
          stripe
        ) {
          const { paymentIntent } = await stripe.retrievePaymentIntent(
            clientSecret
          );
          if (paymentIntent && paymentIntent.status) {
            setPaymentStatus(getStatus(paymentIntent?.status));
          }
        } else if (data?.payment_intent.status === 'created' && yapilyConsent) {
          setPaymentStatus(ResultStatuses.Processing);
        } else {
          setPaymentStatus(ResultStatuses.Error);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [linkData?.id, stripe]);

  const { amount, currency, payment_reference } =
    paymentData?.payment_intent || {};

  const returnUrl =
    paymentData?.return_url === 'null' ? '' : paymentData?.return_url;

  const statusesMap: Record<
    ResultStatuses,
    {
      icon: ReactNode;
      title: string;
      text: string;
    }
  > = {
    processing: {
      icon: (
        <UClockThree
          width={44}
          height={44}
          color={theme.colors.successDarker}
        />
      ),
      title: t('payment:result.processingTitle'),
      text: t('payment:result.processingText'),
    },
    succeeded: {
      icon: (
        <UCheckSquare
          width={44}
          height={44}
          color={theme.colors.successDarker}
        />
      ),
      title: t('payment:result.succeededTitle'),
      text: t('payment:result.succeededText'),
    },
    canceled: {
      icon: (
        <UExclamationTriangle
          width={44}
          height={44}
          color={theme.colors.danger}
        />
      ),
      title: t('payment:result.canceledTitle'),
      text: t('payment:result.canceledText'),
    },
    error: {
      icon: (
        <UExclamationTriangle
          width={44}
          height={44}
          color={theme.colors.danger}
        />
      ),
      title: t('payment:result.errorTitle'),
      text: t('payment:result.errorText'),
    },
  };

  return {
    amount,
    currency,
    paymentReference: payment_reference,
    returnUrl,
    isError:
      paymentStatus === ResultStatuses.Canceled ||
      paymentStatus === ResultStatuses.Error,
    isSuccess:
      paymentStatus === ResultStatuses.Succeeded ||
      paymentStatus === ResultStatuses.Processing,
    currentStatus: paymentStatus
      ? //@ts-ignore
        statusesMap[paymentStatus]
      : ResultStatuses.Error,
    isLoading,
  };
}
