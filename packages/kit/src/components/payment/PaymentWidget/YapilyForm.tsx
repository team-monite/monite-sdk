import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Avatar, Text, Input, Box, UAngleRight, Theme } from '@monite/ui';
import { useTheme } from 'emotion-theming';
import { throttle } from 'lodash';

import BankForm from './YapilyBankForm';
import type { BankItem, PaymentWidgetProps } from './types';

import { demoBanks } from './fixtures/banks';

const StyledBanksList = styled.div`
  > * + * {
    margin-top: 8px;
  }
`;

const StyledBankListItem = styled.div(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border: ${theme.colors.lightGrey2} solid 1px;
  border-radius: 4px;
  padding: 11px;

  &:hover {
    background-color: ${theme.colors.lightGrey3};
    cursor: pointer;
  }
`
);

type BankListItemProps = {
  data: BankItem;
  onClick: (id: string) => void;
};
const BankListItem = ({ data, onClick }: BankListItemProps) => {
  const theme = useTheme<Theme>();

  return (
    <StyledBankListItem
      onClick={() => {
        onClick(data.name);
      }}
    >
      <Avatar size={24} textSize="regular">
        {data.name}
      </Avatar>
      <UAngleRight width={16} height={16} color={theme.colors.lightGrey2} />
    </StyledBankListItem>
  );
};

type YapilyFormProps = {} & PaymentWidgetProps;

const YapilyForm = ({ onFinish }: YapilyFormProps) => {
  const [searchText, setSearchText] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // TODO: here we should fetch an actual list of banks from the API when it will be ready
  const [banks] = useState(demoBanks);

  const updateSearchText = throttle((phrase: string) => {
    setSearchText(phrase);
  }, 200);

  if (selectedBank) {
    // TODO: here we should pass also consentToken
    return <BankForm bankId={selectedBank} onFinish={onFinish} />;
  }

  return (
    <div>
      <Text textSize="h3" mt="44px">
        Continue with your bank account
      </Text>
      <Box mt="24px" mb="32px">
        <Input
          placeholder="Search for your bank"
          onChange={(e) => {
            updateSearchText(e.target.value);
          }}
        />
      </Box>
      <StyledBanksList>
        {(searchText
          ? banks.filter((bank) =>
              bank.name.toLowerCase().includes(searchText.toLowerCase())
            )
          : banks
        ).map((bank) => (
          <BankListItem
            data={bank}
            onClick={(id: string) => {
              // TODO: here we should make an API request to receive authorisationUrl for chosen bank
              // and should redirect the user to this authorisationUrl in order to get the consentToken
              // and should create the payment intent using the consentToken via another API request
              setSelectedBank(id);
            }}
          />
        ))}
      </StyledBanksList>
    </div>
  );
};

export default YapilyForm;
