import React from 'react';
import { useTheme } from 'emotion-theming';
import { useComponentsContext } from '@team-monite/ui-widgets-react';

import {
  Text,
  UMinusCircle,
  Theme,
  Flex,
  Box,
} from '@team-monite/ui-kit-react';

const EmptyScreen = () => {
  const { t } = useComponentsContext();
  const theme = useTheme<Theme>();

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box>
        <UMinusCircle width={40} height={40} color={theme.colors.grey} />
      </Box>
      <Box padding={'0px 124px'}>
        <Text textSize="h3" textAlign="center" color={theme.colors.grey}>
          {t('payment:widget.emptyBankListTitle')}
        </Text>
        <Text textAlign="center" color={theme.colors.grey}>
          {t('payment:widget.emptyBankListContent')}
        </Text>
      </Box>
    </Flex>
  );
};

export default EmptyScreen;
