import {
  FlexTable,
  Flex,
  Box,
  UClockThree,
  Text,
  Theme,
  Card,
  Button,
  UCheckSquare,
  UExclamationTriangle,
} from '@monite/ui-widgets-react';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { fromBase64 } from 'features/app/consts';

import Layout from '../Layout';
import { URLData, PaymentType } from '../types';

enum StripeResultStatuses {
  RequiresPaymentMethod = 'requires_payment_method',
  RequiresConfirmation = 'requires_confirmation',
  RequiresAction = 'requires_action',
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

export const PaymentResultPage = () => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();

  const status = new URLSearchParams(search).get('redirect_status');

  const rawPaymentData = new URLSearchParams(search).get('data');
  const paymentData = rawPaymentData
    ? (fromBase64(rawPaymentData) as URLData)
    : null;

  const type = paymentData?.object?.type;

  const returnUrl =
    type === PaymentType.PAYABLE
      ? paymentData?.return_url || ''
      : `/?data=${rawPaymentData}`;

  console.log('PAYMENTDATA', paymentData);
  const statusesMap = {
    processing: {
      renderIcon: () => (
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
      renderIcon: () => (
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
      renderIcon: () => (
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
      renderIcon: () => (
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

  const getStatus = (paymentStatus: StripeResultStatuses): ResultStatuses => {
    switch (paymentStatus) {
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
  };

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: paymentData?.currency || 'EUR',
  });

  const showReturnButton = () => {
    if (
      (getStatus(status as StripeResultStatuses) === ResultStatuses.Succeeded &&
        type === PaymentType.RECEIVABLE) ||
      (getStatus(status as StripeResultStatuses) ===
        ResultStatuses.Processing &&
        type === PaymentType.RECEIVABLE)
    ) {
      return false;
    }
    return true;
  };

  return (
    <Layout>
      <Flex justifyContent="center">
        <Box width={600} p={4} pt={80}>
          <Card shadow p="48px">
            <Flex alignItems="center" flexDirection="column">
              {statusesMap[
                getStatus(status as StripeResultStatuses)
              ].renderIcon()}
              <Box mt="12px">
                <Text
                  as="h3"
                  textSize="h3"
                  color={
                    getStatus(status as StripeResultStatuses) ===
                      ResultStatuses.Canceled ||
                    getStatus(status as StripeResultStatuses) ===
                      ResultStatuses.Error
                      ? theme.colors.danger
                      : theme.colors.successDarker
                  }
                >
                  {statusesMap[getStatus(status as StripeResultStatuses)].title}
                </Text>
              </Box>
              <Box textAlign="left" mt="24px" mb="24px">
                <Text textSize="regular">
                  {statusesMap[getStatus(status as StripeResultStatuses)].text}
                </Text>
              </Box>
            </Flex>
            {paymentData && (
              <Box textAlign="left">
                <FlexTable>
                  <Flex>
                    <Box width={1 / 3}>
                      <Text color={theme.colors.grey}>
                        {t('payment:result.amount')}
                      </Text>
                    </Box>
                    <Box width={2 / 3}>
                      <Text textSize="bold" color={theme.colors.black}>
                        {formatter.format(paymentData.amount)}
                      </Text>
                    </Box>
                  </Flex>
                  {/* <Flex>
                    <Box width={1 / 3}>
                      <Text color={theme.colors.grey}>
                        {t('payment:result.payee')}
                      </Text>
                    </Box>
                    <Box width={2 / 3}>
                      <Text textSize="bold">{paymentData.payee?.name}</Text>
                    </Box>
                  </Flex>
                  <Flex>
                    <Box width={1 / 3}>
                      <Text color={theme.colors.grey}>
                        {t('payment:result.iban')}{' '}
                      </Text>
                    </Box>
                    <Box width={2 / 3}>
                      <Text textSize="bold">
                        {paymentData.payee?.account_identification?.value}
                      </Text>
                    </Box>
                  </Flex> */}
                  <Flex>
                    <Box width={1 / 3}>
                      <Text color={theme.colors.grey}>
                        {t('payment:result.reference')}
                      </Text>
                    </Box>
                    <Box width={2 / 3}>
                      <Text textSize="bold">
                        {paymentData.payment_reference}{' '}
                      </Text>
                    </Box>
                  </Flex>
                </FlexTable>
              </Box>
            )}

            {showReturnButton() && (
              <Flex justifyContent="center">
                <Box width={'160px'}>
                  <Button mt="24px" block onClick={() => navigate(returnUrl)}>
                    {getStatus(status as StripeResultStatuses) ===
                      ResultStatuses.Succeeded ||
                    getStatus(status as StripeResultStatuses) ===
                      ResultStatuses.Processing
                      ? t('payment:result.return')
                      : t('payment:result.tryAgain')}
                  </Button>
                </Box>
              </Flex>
            )}
          </Card>
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentResultPage;
