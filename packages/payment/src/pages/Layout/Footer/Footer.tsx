import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Box, Text, Link } from '@team-monite/ui-kit-react';

import { useTheme } from '@emotion/react';
import MoniteLogo from '../MoniteLogo';

const Footer = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Flex
      ml={[0, '32px']}
      mb={'32px'}
      mt={'32px'}
      justifyContent={['center', 'flex-start']}
    >
      <Flex flexDirection={['column', 'row']}>
        <Flex alignItems={'center'} width={['100%', 'auto']}>
          <Text color={theme.colors.grey} mr={'4px'} textSize={'small'}>
            {t('payment:footer.poweredBy')}
          </Text>
          <MoniteLogo color={theme.colors.grey} />
          <Box
            height={'100%'}
            ml={'16px'}
            sx={{ borderRight: `1px solid ${theme.colors.lightGrey2}` }}
            display={['none', 'block']}
          />
        </Flex>

        <Flex width={['100%', 'auto']}>
          <Link href="https://monite.com/terms/">
            <Text textSize={'smallLink'} color={theme.colors.grey} ml={'16px'}>
              {t('payment:footer.terms')}
            </Text>
          </Link>
          <Link href="https://monite.com/data-privacy/">
            <Text textSize={'smallLink'} color={theme.colors.grey} ml={'16px'}>
              {t('payment:footer.privacy')}
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
