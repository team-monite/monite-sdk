import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import {
  Text,
  Box,
  UAngleRight,
  Theme,
  Flex,
  UCreditCard,
  UUniversity,
  UMoneyBill,
} from '@team-monite/ui-kit-react';
import { PaymentsPaymentMethodsEnum } from '@team-monite/sdk-api';

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

// TODO add localization
const SelectPaymentMethod = ({ paymentMethods }: SelectPaymentMethodProps) => {
  const { search } = useLocation();
  const theme = useTheme<Theme>();

  return (
    <>
      <Text textSize="h3" textAlign="center">
        How would you like to pay?
      </Text>

      <Box mt={24}>
        {paymentMethods.includes(PaymentsPaymentMethodsEnum.CARD) && (
          <StyledLink to={`card${search}`}>
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
                  <Text>Credit card</Text>
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

        {paymentMethods.includes(PaymentsPaymentMethodsEnum.SEPA_CREDIT) && (
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
                  <Text>Bank transfer</Text>
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

        {paymentMethods.filter(
          (method) =>
            method !== PaymentsPaymentMethodsEnum.CARD &&
            method !== PaymentsPaymentMethodsEnum.SEPA_CREDIT
        ).length > 0 && (
          <StyledLink to={`other${search}`}>
            <StyledListItem>
              <Flex alignItems="center">
                <StyledIconBlock>
                  <UMoneyBill
                    width={16}
                    height={16}
                    color={theme.colors.black}
                  />
                </StyledIconBlock>
                <Box ml={1}>
                  <Text>Other payment methods</Text>
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
