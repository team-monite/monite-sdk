import { getReadableAmount } from '@team-monite/ui-widgets-react';
import {
  FlexTable,
  Flex,
  Box,
  Text,
  Card,
  Button,
  Theme,
  Loading,
} from '@team-monite/ui-kit-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';

import { InternalPaymentLinkResponse } from '@team-monite/sdk-api';

import Layout from '../Layout';
import usePaymentResult from './usePaymentResult';

type PaymentResultPageProps = {
  paymentData?: InternalPaymentLinkResponse;
  isLoading: boolean;
};
export const PaymentResultPage = ({
  paymentData,
  isLoading,
}: PaymentResultPageProps) => {
  const theme = useTheme<Theme>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { search } = useLocation();

  const {
    currentStatus: { icon, title, text },
    isError,
    isSuccess,
    amount,
    currency,
    returnUrl,
    paymentReference,
  } = usePaymentResult(paymentData);

  return (
    <Layout>
      {isLoading && <Loading />}

      {paymentData && (
        <Flex justifyContent="center">
          <Box width={600} p={4} pt={80}>
            <Card shadow p={[16, 32]}>
              <Flex alignItems="center" flexDirection="column">
                {icon}
                <Box mt="12px">
                  <Text
                    as="h3"
                    textSize="h3"
                    textAlign="center"
                    color={
                      isError ? theme.colors.danger : theme.colors.successDarker
                    }
                  >
                    {title}
                  </Text>
                </Box>
                <Box textAlign="center" mt="24px" mb="24px">
                  <Text textSize="regular">{text}</Text>
                </Box>
              </Flex>
              {!!amount && currency && (
                <Box textAlign="left">
                  <FlexTable>
                    <Flex alignItems="flexStart">
                      <Box width={'50%'}>
                        <Text color={theme.colors.grey} textSize="small">
                          {t('payment:result.amount')}
                        </Text>
                      </Box>
                      <Box width={'50%'}>
                        <Text textSize="smallBold" color={theme.colors.black}>
                          {getReadableAmount(amount, currency)}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex alignItems="flex-start">
                      <Box width={'50%'}>
                        <Text color={theme.colors.grey} textSize="small">
                          {t('payment:result.reference')}
                        </Text>
                      </Box>
                      <Box width={'50%'}>
                        <Text textSize="smallBold">{paymentReference} </Text>
                      </Box>
                    </Flex>
                  </FlexTable>
                </Box>
              )}

              {!isSuccess && (
                <Flex justifyContent="center">
                  <Box width={'160px'}>
                    <Button
                      mt="24px"
                      block
                      onClick={() => navigate(`/${search}`)}
                    >
                      {t('payment:result.tryAgain')}
                    </Button>
                  </Box>
                </Flex>
              )}

              {returnUrl && isSuccess && (
                <Flex justifyContent="center">
                  <Box width={'160px'}>
                    <Button
                      mt="24px"
                      block
                      onClick={() => (window.location.href = returnUrl)}
                    >
                      {t('payment:result.return')}
                    </Button>
                  </Box>
                </Flex>
              )}
            </Card>
          </Box>
        </Flex>
      )}
    </Layout>
  );
};

export default PaymentResultPage;
