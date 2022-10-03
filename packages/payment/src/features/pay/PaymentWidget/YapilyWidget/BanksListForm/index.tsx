import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { throttle } from 'lodash';

import {
  ReceivableResponse,
  PaymentsPaymentsCountry,
  PaymentsPaymentsBank,
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentMethodsCountriesResponse,
  PaymentsPaymentsPaymentsPaymentsBanksResponse,
  PaymentsPaymentsMedia,
} from '@team-monite/sdk-api';
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
} from '@team-monite/ui-kit-react';
import { useComponentsContext } from '@team-monite/ui-widgets-react';

import SelectCountries from '../SelectCountries';
import EmptyBankList from '../EmptyBankList';

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
  const logo = data.media.find(
    (item: PaymentsPaymentsMedia) => item.type === 'icon'
  )?.source;

  return (
    <StyledBankListItem>
      <Flex>
        {/* TODO: test with backend */}
        <Avatar size={24} textSize="regular" src={logo} />
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
  const { t, monite } = useComponentsContext();

  const [searchText, setSearchText] = useState('');
  const [country, setCountry] = useState(
    PaymentsYapilyCountriesCoverageCodes.DE
  );

  const [banks, setBanks] = useState<Array<PaymentsPaymentsBank>>([]);
  const [countries, setCountries] = useState<Array<PaymentsPaymentsCountry>>();

  const updateSearchText = throttle((phrase: string) => {
    setSearchText(phrase);
  }, 200);
  const { search } = useLocation();

  useEffect(() => {
    monite.api.payment
      .getPaymentMethodCountries('sepa_credit')
      .then((response: PaymentsPaymentMethodsCountriesResponse) => {
        setCountries(response.data);
      });
  }, [monite.api.payment]);

  useEffect(() => {
    monite.api.payment
      .getInstitutions(
        'sepa_credit',
        country as PaymentsYapilyCountriesCoverageCodes
      )
      .then((response: PaymentsPaymentsPaymentsPaymentsBanksResponse) => {
        setBanks(response.data);
      });
  }, [country, monite.api.payment]);

  const filteredBanks = searchText
    ? banks.filter((bank) =>
        bank.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : banks;

  return (
    <>
      <div>
        <Text textSize="h3" align="center">
          {t('payment:widget.banksListTitle')}
        </Text>
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
              placeholder={t('payment:widget.banksSearchPlaceholder')}
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
          {filteredBanks.length ? (
            filteredBanks.map((bank) => (
              <Link to={`${bank.code}${search}`} className={styles.link}>
                <BankListItem data={bank} />
              </Link>
            ))
          ) : (
            <EmptyBankList />
          )}
        </Box>
      </div>
    </>
  );
};

export default YapilyForm;
