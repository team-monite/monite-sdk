import React, { useState, useEffect } from 'react';

import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { throttle } from 'lodash';
import { useTranslation, Trans } from 'react-i18next';

import {
  PaymentsPaymentsBank,
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentsMedia,
  MoniteAllPaymentMethodsTypes,
} from '@team-monite/sdk-api';
import { useInstitutionList, useCountryList } from 'core/queries/usePayment';

import {
  Avatar,
  Text,
  Input,
  Link,
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
  isOnlyYapilyAvailable: boolean;
};

const BankListForm = ({
  setSelectedBank,
  handleNextStep,
  selectedCountry,
  setSelectedCountry,
  onChangeMethod,
  isOnlyYapilyAvailable,
}: BankListFormProps) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [showReadMore, setShowReadMore] = useState(false);

  const { data: countriesData } = useCountryList(
    MoniteAllPaymentMethodsTypes.SEPA_CREDIT
  );

  const { data: banksData, refetch: refetchInstitutionList } =
    useInstitutionList(
      MoniteAllPaymentMethodsTypes.SEPA_CREDIT,
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
              {!isOnlyYapilyAvailable && (
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
              )}
              <Box mt={30}>
                <Text textSize="small" $color="grey">
                  <Trans i18nKey="payment:bankWidget.termsAndConditions">
                    {/*eslint-disable-next-line*/}
                    By using the service, you agree to Yapily’s <Link href="https://docs.yapily.com/590afe32d4002480e93f75b9793471dc/YapilyConnect-Ltd-v20200908.pdf" color="grey" textSize="smallLink">Terms & Conditions</Link> and <Link href="https://www.yapily.com/legal/privacy-policy" color="grey" textSize="smallLink">Privacy Policy</Link>.<br />Yapily will retrieve your account information <Link href="#" color="grey" textSize="smallLink" onClick={() => setShowReadMore((prev) => !prev)}>Read more</Link>.
                  </Trans>
                </Text>
              </Box>
              {showReadMore && (
                <Box mt={20}>
                  <Text textSize="small" $color="grey">
                    <Trans i18nKey="payment:bankWidget.readMore">
                      {/*eslint-disable-next-line*/}
                      By using this service you will be securely redirected to your bank to confirm your consent for Yapily Connect to read and receive the following information: Identification details, Account(s) details, Balances, Interest rates, Other transactional and account information. For more information please refer to the Yapily Connect’s <Link href="https://docs.yapily.com/590afe32d4002480e93f75b9793471dc/YapilyConnect-Ltd-v20200908.pdf" color="grey" textSize="smallLink">Terms & Conditions</Link>
                    </Trans>
                  </Text>
                </Box>
              )}
            </>
          ) : (
            <EmptyBankList
              onChangeMethod={isOnlyYapilyAvailable ? null : onChangeMethod}
            />
          )}
        </Box>
      </div>
    </>
  );
};

export default BankListForm;
