import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { throttle } from 'lodash';

import {
  ReceivableResponse,
  PaymentsPaymentsCountry,
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentsBank,
} from '@monite/sdk-api';
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
import { useComponentsContext } from '@monite/ui-widgets-react';

import InvoiceDetailes from '../InvoiceDetailes';
import SelectCountries from '../SelectCountries';

import styles from './style.module.scss';

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
  data: PaymentsPaymentsBank;
};

const BankListItem = ({ data }: BankListItemProps) => {
  const theme = useTheme<Theme>();

  return (
    <StyledBankListItem>
      <Flex>
        {/* TODO: test with backend */}
        <Avatar size={24} textSize="regular" src={data.media[0].source} />
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

// const countriesMock = {
//   data: [
//     { name: 'Austria', code: 'AT' },
//     { name: 'Belgium', code: 'BE' },
//     { name: 'Denmark', code: 'DK' },
//     { name: 'Estonia', code: 'EE' },
//     { name: 'Finland', code: 'FI' },
//     { name: 'France', code: 'FR' },
//     { name: 'Germany', code: 'DE' },
//     { name: 'Iceland', code: 'IS' },
//     { name: 'Ireland', code: 'IE' },
//     { name: 'Italy', code: 'IT' },
//     { name: 'Latvia', code: 'LV' },
//     { name: 'Lithuania', code: 'LT' },
//     { name: 'Netherlands', code: 'NL' },
//     { name: 'Norway', code: 'NO' },
//     { name: 'Poland', code: 'PL' },
//     { name: 'Portugal', code: 'PT' },
//     { name: 'Spain', code: 'ES' },
//     { name: 'Sweden', code: 'SE' },
//     { name: 'United Kingdom', code: 'GB' },
//   ],
// };
const YapilyForm = ({ receivableData }: YapilyFormProps) => {
  const { monite } = useComponentsContext();

  const [searchText, setSearchText] = useState('');
  const [country, setCountry] = useState('DE');

  const [banks, setBanks] = useState<Array<PaymentsPaymentsBank>>([]);
  const [countries, setCountries] = useState<Array<PaymentsPaymentsCountry>>();

  const updateSearchText = throttle((phrase: string) => {
    setSearchText(phrase);
  }, 200);
  const { search } = useLocation();

  useEffect(() => {
    monite.api.payment
      .getPaymentMethodCountries('sepa_credit')
      .then((response) => {
        setCountries(response.data);
      });
  }, [monite.api.payment]);

  useEffect(() => {
    monite.api.payment
      .getInstitutions(
        'sepa_credit',
        country as PaymentsYapilyCountriesCoverageCodes
      )
      .then((response) => {
        setBanks(response.data);
      });
  }, [country, monite.api.payment]);

  return (
    <div>
      <Text textSize="h3" align="center">
        Continue with your bank account
      </Text>
      <Routes>
        <Route
          path={':code'}
          element={
            <InvoiceDetailes banks={banks} receivableData={receivableData} />
          }
        />
      </Routes>
      <Flex mt="24px" mb="32px">
        {countries && (
          <Box mr={'16px'}>
            <SelectCountries
              value={country}
              onChange={(val) => {
                setCountry(val.value);
              }}
              data={countries}
            />
          </Box>
        )}
        <Box width={355}>
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
      </Flex>
      <Box>
        {(searchText
          ? banks.filter((bank) =>
              bank.name.toLowerCase().includes(searchText.toLowerCase())
            )
          : banks
        ).map((bank) => (
          <Link to={`${bank.code}${search}`} className={styles.link}>
            <BankListItem data={bank} />
          </Link>
        ))}
      </Box>
    </div>
  );
};

export default YapilyForm;
