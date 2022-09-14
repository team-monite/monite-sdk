import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { throttle } from 'lodash';

import { ReceivableResponse } from '@monite/sdk-api';
import {
  Avatar,
  Text,
  Input,
  Box,
  UAngleRight,
  Theme,
  USearchAlt,
  IconButton,
  Flex,
} from '@monite/ui-kit-react';

import InvoiceDetailes from '../InvoiceDetailes';
import type { BankItem } from '../types';

import styles from './style.module.scss';

import { demoBanks } from '../../fixtures/banks';

const StyledBankListItem = styled.div(
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
    background-color: ${theme.colors.lightGrey3};
    cursor: pointer;
  }
`
);

type BankListItemProps = {
  data: BankItem;
};
const BankListItem = ({ data }: BankListItemProps) => {
  const theme = useTheme<Theme>();

  return (
    <StyledBankListItem>
      <Flex>
        <Avatar size={24} textSize="regular" src={data.logo} />
        <Box ml={1}>
          <Text>{data.name}</Text>
        </Box>
      </Flex>
      <UAngleRight width={16} height={16} color={theme.colors.lightGrey2} />
    </StyledBankListItem>
  );
};

type YapilyFormProps = {
  receivableData?: ReceivableResponse;
};

const YapilyForm = ({ receivableData }: YapilyFormProps) => {
  const [searchText, setSearchText] = useState('');

  // TODO: here we should fetch an actual list of banks from the API when it will be ready
  const [banks] = useState(demoBanks);

  const updateSearchText = throttle((phrase: string) => {
    setSearchText(phrase);
  }, 200);
  const { search } = useLocation();

  return (
    <div>
      <Text textSize="h3" align="center">
        Continue with your bank account
      </Text>
      <Routes>
        <Route
          path={':id'}
          element={
            <InvoiceDetailes banks={banks} receivableData={receivableData} />
          }
        />
      </Routes>
      <Box mt="24px" mb="32px">
        <Input
          placeholder="Search for your bank"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateSearchText(e.target.value);
          }}
          renderAddonIcon={() => (
            <IconButton color={'lightGrey1'}>
              <USearchAlt size={20} />
            </IconButton>
          )}
        />
      </Box>
      <Box>
        {(searchText
          ? banks.filter((bank) =>
              bank.name.toLowerCase().includes(searchText.toLowerCase())
            )
          : banks
        ).map((bank) => (
          <Link to={`${bank.id}${search}`} className={styles.link}>
            <BankListItem data={bank} />
          </Link>
        ))}
      </Box>
    </div>
  );
};

export default YapilyForm;
