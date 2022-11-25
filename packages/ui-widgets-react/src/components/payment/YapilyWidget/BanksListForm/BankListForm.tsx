import React, { useState, useEffect } from 'react';

import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  PaymentsPaymentsBank,
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentsMedia,
  PaymentsPaymentMethodsEnum,
} from '@team-monite/sdk-api';
import { useInstitutionList, useCountryList } from 'core/queries/usePayment';

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
  Button,
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

const StyledLink = styled.span`
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

type BankListFormProps = {
  setSelectedBank: (bank: PaymentsPaymentsBank) => void;
  handleNextStep: () => void;
  selectedCountry: PaymentsYapilyCountriesCoverageCodes;
  setSelectedCountry: (country: PaymentsYapilyCountriesCoverageCodes) => void;
  onChangeMethod: () => void;
};
const BankListForm = ({
  setSelectedBank,
  handleNextStep,
  selectedCountry,
  setSelectedCountry,
  onChangeMethod,
}: BankListFormProps) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  const { data: countriesData } = useCountryList(
    PaymentsPaymentMethodsEnum.SEPA_CREDIT
  );

  const { data: banksData, refetch: refetchInstitutionList } =
    useInstitutionList(
      PaymentsPaymentMethodsEnum.SEPA_CREDIT,
      selectedCountry as PaymentsYapilyCountriesCoverageCodes
    );

  const banks = banksData?.data || [];
  const countries = countriesData?.data || [];

  useEffect(() => {
    refetchInstitutionList();
  }, [selectedCountry]);

  const [searchText, setSearchText] = useState('');

  const updateSearchText = throttle((phrase: string) => {
    setSearchText(phrase);
  }, 200);

  const filteredBanks = searchText
    ? banks.filter((bank) =>
        bank.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : banks;

  return (
    <>
      <div>
        <Text textSize="h3" textAlign="center">
          {t('payment:bankWidget.banksListTitle')}
        </Text>
        <Flex mt="24px" mb="32px">
          {countries && (
            <Box mr={'12px'}>
              <SelectCountries
                value={selectedCountry}
                onChange={(val) => {
                  setSelectedCountry(val.value);
                }}
                data={countries}
              />
            </Box>
          )}
          <Box width={['65%', '85%']}>
            <Input
              placeholder={t('payment:bankWidget.banksSearchPlaceholder')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateSearchText(e.target.value);
              }}
              renderAddonIcon={() => (
                <IconButton color={theme.colors.lightGrey1}>
                  <USearchAlt size={20} />
                </IconButton>
              )}
            />
          </Box>
        </Flex>
        <Box>
          {filteredBanks.length ? (
            <>
              {filteredBanks.map((bank) => (
                <StyledLink
                  key={bank.code}
                  onClick={() => {
                    setSelectedBank(bank);
                    handleNextStep();
                  }}
                >
                  <BankListItem data={bank} />
                </StyledLink>
              ))}
              <Box mt={'20px'}>
                <Button
                  variant={'text'}
                  onClick={onChangeMethod}
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    width: '100%',
                  }}
                >
                  <Text textAlign="center">
                    {t('payment:bankWidget.selectMethodLink')}
                  </Text>
                </Button>
              </Box>
            </>
          ) : (
            <EmptyBankList onChangeMethod={onChangeMethod} />
          )}
        </Box>
      </div>
    </>
  );
};

export default BankListForm;
