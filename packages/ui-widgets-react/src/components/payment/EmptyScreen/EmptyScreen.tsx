import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text, UMinusCircle, Flex, Box } from '@team-monite/ui-kit-react';

const EmptyScreen = () => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box>
        <UMinusCircle width={40} height={40} color={'grey'} />
      </Box>
      <Text textSize="h3" align="center" color={'grey'}>
        {t('payment:widget.emptyTitle')}
      </Text>
      <Text align="center" color={'grey'}>
        {t('payment:widget.emptyDescription')}
      </Text>
    </Flex>
  );
};

export default EmptyScreen;
