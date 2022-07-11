import {
  FlexTable,
  Flex,
  Box,
  UClockThree,
  Text,
  Theme,
} from '@monite/react-kit';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';

import AuthLayout from 'features/auth/Layout';

// ex: /pay/123/result
// ?payment_intent=pi_3LIfaSCq0HpJYRYN0QS5lQ0O
// &payment_intent_client_secret=pi_3LIfaSCq0HpJYRYN0QS5lQ0O_secret_E4uCICSwwzLIvbiYiOelzwKuK
// &redirect_status=succeeded

export const PaymentResultPage = () => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  // TODO: fetch receivable data from the API endpoint WHEN it will be ready
  // fields: doc id, doc number, counterpart name, iban, price

  return (
    <AuthLayout>
      <Flex justifyContent="center">
        <UClockThree
          width={44}
          height={44}
          color={theme.colors.successDarker}
        />
      </Flex>
      <Box mt="12px">
        <Text as="h3" textSize="h3" color="successDarker">
          {t('payment:result.title')}
        </Text>
      </Box>
      <Box textAlign="left">
        <Text textSize="regular">
          {t('payment:result.text', {
            payer: 'Olga',
            id: '#FA-000231',
            payee: 'Toledo',
            price: '293,74 Euro',
          })}
        </Text>
      </Box>
      <Box textAlign="left">
        <FlexTable>
          <Flex>
            <Box width={1 / 2}>{t('payment:result.payee')}</Box>
            <Box width={1 / 2}>Toledo GmbH</Box>
          </Flex>
          <Flex>
            <Box width={1 / 2}>{t('payment:result.iban')}</Box>
            <Box width={1 / 2}>DE89 0000 0000 9988 8888</Box>
          </Flex>
          <Flex>
            <Box width={1 / 2}>{t('payment:result.reference')}</Box>
            <Box width={1 / 2}>#FA-000231</Box>
          </Flex>
        </FlexTable>
      </Box>
    </AuthLayout>
  );
};

export default PaymentResultPage;
