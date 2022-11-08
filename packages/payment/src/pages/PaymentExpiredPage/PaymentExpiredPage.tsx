import {
  Flex,
  Box,
  Text,
  Card,
  Theme,
  UClockThree,
} from '@team-monite/ui-kit-react';

import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';

import Layout from '../Layout';

const PaymentResultPage = () => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  return (
    <Layout>
      <Flex justifyContent="center">
        <Box width={600} p={4} pt={80}>
          <Card shadow p="48px">
            <Flex alignItems="center" flexDirection="column">
              <UClockThree width={44} height={44} color={theme.colors.danger} />
              <Box mt="12px">
                <Text as="h3" textSize="h3" color={theme.colors.danger}>
                  {t('payment:widget.expiredTitle')}
                </Text>
              </Box>
              <Box textAlign="center" mt="24px" mb="24px">
                <Text textSize="regular">
                  {t('payment:widget.expiredContent')}
                </Text>
              </Box>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentResultPage;
