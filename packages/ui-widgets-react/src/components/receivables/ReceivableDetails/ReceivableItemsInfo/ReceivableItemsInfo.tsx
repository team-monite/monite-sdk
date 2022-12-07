import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReceivableResponse } from '@team-monite/sdk-api';
import { FlexTable, Flex, Box, Text } from '@team-monite/ui-kit-react';
import { getReadableAmount } from 'core/utils';
import { Title, StyledContent } from '../ReceivableDetailsStyle';

export type PayablesDetailsInfoProps = {
  receivable: ReceivableResponse;
};

const ReceivableItemsInfo = ({ receivable }: PayablesDetailsInfoProps) => {
  const { t } = useTranslation();

  return (
    <StyledContent>
      <Title textSize={'bold'}>{t('receivables:items')}</Title>
      <FlexTable>
        <Flex>
          <Box width={'45%'}>
            <Text textSize="small">{t('receivables:columns.name')}</Text>
          </Box>
          <Box width={'25%'}>
            <Text textSize="small">{t('receivables:columns.amount')}</Text>
          </Box>
          <Box width={'30%'}>
            <Text textSize="small">{t('receivables:columns.total')}</Text>
          </Box>
        </Flex>

        {receivable?.line_items?.map((item) => (
          <Flex>
            <Box width={'45%'}>
              <Text>{item.product.name}</Text>
            </Box>
            <Box width={'25%'}>
              <Text>{item.quantity}</Text>
            </Box>
            <Box width={'30%'}>
              <Text>
                {item.product.price &&
                  item.product.price.currency &&
                  getReadableAmount(
                    item.quantity * item.product.price.value,
                    item.product.price.currency
                  )}
              </Text>
            </Box>
          </Flex>
        ))}
      </FlexTable>
    </StyledContent>
  );
};

export default ReceivableItemsInfo;
