import React from 'react';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';

import {
  Text,
  UMinusCircle,
  Theme,
  Flex,
  Box,
  Button,
} from '@team-monite/ui-kit-react';

const EmptyBankList = ({ onChangeMethod }: { onChangeMethod: () => void }) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box>
        <UMinusCircle width={40} height={40} color={theme.colors.grey} />
      </Box>
      <Box padding={['0', '0px 80px']}>
        <Text textSize="h3" textAlign="center" color={theme.colors.grey}>
          {t('payment:bankWidget.emptyBankListTitle')}
        </Text>
        <Text textAlign="center" color={theme.colors.grey}>
          {t('payment:bankWidget.emptyBankListContent')}
        </Text>
      </Box>
      <Box padding={'16px'}>
        <Button color="secondary" onClick={onChangeMethod}>
          {t('payment:bankWidget.changeMethod')}
        </Button>
      </Box>
    </Flex>
  );
};

export default EmptyBankList;
