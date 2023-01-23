import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';

import {
  Text,
  Box,
  UAngleRight,
  Theme,
  Flex,
  UCreditCard,
  UUniversity,
} from '@team-monite/ui-kit-react';
import { MoniteAllPaymentMethodsTypes } from '@team-monite/sdk-api';

type SelectPaymentMethodProps = {
  paymentMethods: string[];
};

const StyledListItem = styled.div(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;

  border: ${theme.colors.lightGrey2} solid 1px;
  border-radius: 4px;
  padding: 11px;

  &:hover {
    background-color: ${theme.colors.black};
    color:${theme.colors.white};
    cursor: pointer;
  }
`
);

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const StyledIconBlock = styled.div(
  ({ theme }) => `
  display: flex;
  border-radius: 2px;
  background-color: ${theme.colors.lightGrey3};
  width: 32px;
  height: 20px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  &:hover {
    background-color: ${theme.colors.white};
  }
`
);

const SelectPaymentMethod = ({ paymentMethods }: SelectPaymentMethodProps) => {
  const { search } = useLocation();
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  return (
    <>
      <Text textSize="h3" textAlign="center">
        {t('payment:widget.selectTitle')}
      </Text>

      <Box mt={24}>
        {paymentMethods.filter(
          (method) => method !== MoniteAllPaymentMethodsTypes.SEPA_CREDIT
        ).length > 0 && (
          <StyledLink to={`checkout${search}`}>
            <StyledListItem>
              <Flex alignItems="center">
                <StyledIconBlock>
                  <UCreditCard
                    width={16}
                    height={16}
                    color={theme.colors.black}
                  />
                </StyledIconBlock>
                <Box ml={1}>
                  <Text>{t('payment:widget.cardPlusOther')} </Text>
                </Box>
              </Flex>
              <UAngleRight
                width={16}
                height={16}
                color={theme.colors.lightGrey2}
              />
            </StyledListItem>
          </StyledLink>
        )}

        {paymentMethods.includes(MoniteAllPaymentMethodsTypes.SEPA_CREDIT) && (
          <StyledLink to={`bank${search}`}>
            <StyledListItem>
              <Flex alignItems="center">
                <StyledIconBlock>
                  <UUniversity
                    width={16}
                    height={16}
                    color={theme.colors.black}
                  />
                </StyledIconBlock>
                <Box ml={1}>
                  <Text>{t('payment:widget.bankTransfer')}</Text>
                </Box>
              </Flex>
              <UAngleRight
                width={16}
                height={16}
                color={theme.colors.lightGrey2}
              />
            </StyledListItem>
          </StyledLink>
        )}
      </Box>
    </>
  );
};

export default SelectPaymentMethod;
