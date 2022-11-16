import { getReadableAmount } from '@team-monite/ui-widgets-react';
import {
  FlexTable,
  Flex,
  Box,
  Text,
  Card,
  Button,
  Theme,
} from '@team-monite/ui-kit-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';

import Layout from '../Layout';
import usePaymentResult from './usePaymentResult';

export const PaymentResultPage = () => {
  const theme = useTheme<Theme>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    currentStatus: { icon, title, text },
    isError,
    isSuccess,
    amount,
    currency,
    returnUrl,
    paymentReference,
  } = usePaymentResult();

  return (
    <Layout>
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

            {returnUrl && (
              <Flex justifyContent="center">
                <Box width={'160px'}>
                  <Button mt="24px" block onClick={() => navigate(returnUrl)}>
                    {isSuccess
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
