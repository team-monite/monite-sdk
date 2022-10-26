import { ReactNode, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'emotion-theming';
import {
  Theme,
  UCheckSquare,
  UClockThree,
  UExclamationTriangle,
} from '@team-monite/ui-widgets-react';
import { useLocation } from 'react-router-dom';
import { RecipientType } from '../types';

enum StripeResultStatuses {
  // RequiresPaymentMethod = 'requires_payment_method',
  // RequiresConfirmation = 'requires_confirmation',
  // RequiresAction = 'requires_action',
  Processing = 'processing',
  RequiresCapture = 'requires_capture',
  Canceled = 'canceled',
  Succeeded = 'succeeded',
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

  const redirect_status = urlParams.get('redirect_status');
  const amount = Number(urlParams.get('amount'));
  const currency = urlParams.get('currency');
  const recipientType = urlParams.get('recipient_type');
  const linkData = urlParams.get('data');
  const return_url = urlParams.get('return_url');
  const paymentReference = urlParams.get('payment_reference');

  const returnUrl =
    recipientType === RecipientType.COUNTERPART
      ? return_url || ''
      : `/?data=${linkData}`;

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

  const [status] = useState<ResultStatuses>(() => {
    switch (redirect_status) {
      case StripeResultStatuses.Processing:
      case StripeResultStatuses.RequiresCapture:
        return ResultStatuses.Processing;
      case StripeResultStatuses.Canceled:
        return ResultStatuses.Canceled;
      case StripeResultStatuses.Succeeded:
        return ResultStatuses.Succeeded;
      default:
        return ResultStatuses.Error;
    }
  });

  return {
    amount,
    currency,
    paymentReference,
    returnUrl,
    isError:
      status === ResultStatuses.Canceled || status === ResultStatuses.Error,
    isSuccess:
      status === ResultStatuses.Succeeded ||
      status === ResultStatuses.Processing,
    currentStatus: statusesMap[status],
  };
}
