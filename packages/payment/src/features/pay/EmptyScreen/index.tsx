import React from 'react';
import { useTheme } from 'emotion-theming';
import { useComponentsContext } from '@monite/react-kit';

import { Text, UMinusCircle, Theme, Flex, Box } from '@monite/ui';

const EmptyScreen = () => {
  const { t } = useComponentsContext();
  const theme = useTheme<Theme>();

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box>
        <UMinusCircle width={40} height={40} color={theme.colors.grey} />
      </Box>
      <Text textSize="h3" align="center" color={theme.colors.grey}>
        {t('payment:widget.emptyTitle')}
      </Text>
      <Text align="center" color={theme.colors.grey}>
        {t('payment:widget.emptyDescription')}
      </Text>
    </Flex>
  );
};

export default EmptyScreen;
