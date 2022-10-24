import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  PaymentsPaymentsCountry,
  PaymentsPaymentsBank,
  PaymentsYapilyCountriesCoverageCodes,
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

import SelectCountries from '../SelectCountries';
import EmptyBankList from '../EmptyBankList';

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

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

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
  banks?: PaymentsPaymentsBank[];
  countries?: Array<PaymentsPaymentsCountry>;
  selectedCountry: PaymentsYapilyCountriesCoverageCodes;
  onChangeCountry: (country: PaymentsYapilyCountriesCoverageCodes) => void;
};
const YapilyForm = ({
  banks = [],
  countries,
  selectedCountry,
  onChangeCountry,
}: YapilyFormProps) => {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState('');

  const updateSearchText = throttle((phrase: string) => {
    setSearchText(phrase);
  }, 200);

  const { search } = useLocation();

  const filteredBanks = searchText
    ? banks.filter((bank) =>
        bank.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : banks;

  return (
    <>
      <div>
        <Text textSize="h3" align="center">
          {t('payment:bankWidget.banksListTitle')}
        </Text>
        <Flex mt="24px" mb="32px">
          {countries && (
            <Box mr={'16px'}>
              <SelectCountries
                value={selectedCountry}
                onChange={(val) => {
                  onChangeCountry(val.value);
                }}
                data={countries}
              />
            </Box>
          )}
          <Box width={355}>
            <Input
              placeholder={t('payment:bankWidget.banksSearchPlaceholder')}
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
              <StyledLink
                to={
                  bank.payer_required
                    ? `${bank.code}/payer_form${search}`
                    : `${bank.code}/confirm${search}`
                }
              >
                <BankListItem data={bank} />
              </StyledLink>
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
