import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import {
  Text,
  Button,
  Box,
  Avatar,
  Flex,
  List,
  ListItem,
} from '@team-monite/ui-kit-react';

import { useParams } from 'react-router-dom';

import {
  PaymentsPaymentLinkResponse,
  PaymentsPaymentsBank,
  PaymentsPaymentsMedia,
} from '@team-monite/sdk-api';

import usePaymentDetails from '../../PaymentDetails/usePaymentDetails';

type InvoiceDetailsProps = {
  banks?: PaymentsPaymentsBank[];
  paymentData: PaymentsPaymentLinkResponse;
};

const StyledLabel = styled(Box)`
  flex-basis: 220px;
`;

const StyledValueBlock = styled(Box)`
  flex-grow: 1;
`;

const StyledDetails = styled(List)`
  margin: 32px 0;
`;

const InvoiceDetails = ({ banks, paymentData }: InvoiceDetailsProps) => {
  const { code } = useParams();
  const { t } = useTranslation();

  const bankData = banks?.find((bank) => bank.code === code);

  const logo = bankData?.media.find(
    (item: PaymentsPaymentsMedia) => item.type === 'icon'
  )?.source;

  const { recipient, amount, paymentReference } = usePaymentDetails({
    payment: paymentData,
  });

  const infoPanelMap = {
    dataSharing: {
      label: t('payment:bankWidget.dataSharingLabel'),
      tip: t('payment:bankWidget.dataSharingTip', { name: recipient }),
    },
    secureConnection: {
      label: t('payment:bankWidget.secureConnectionLabel'),
      tip: t('payment:bankWidget.secureConnectionTip'),
    },
    access: {
      label: t('payment:bankWidget.accessLabel'),
      tip: t('payment:bankWidget.accessTip'),
    },
    authorization: {
      label: t('payment:bankWidget.authorizationLabel'),
      tip: t('payment:bankWidget.authorizationTip'),
    },
  };

  return (
    <Box>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Avatar size={44} src={logo}></Avatar>
        <Text textSize="h3" mt="12px" textAlign="center">
          {bankData?.name}
        </Text>
      </Flex>
      <StyledDetails>
        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel className={'styles.label'}>
              {t('payment:bankWidget.amount')}
            </StyledLabel>
            <StyledValueBlock className={'styles.value'}>
              {amount}
            </StyledValueBlock>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel>{t('payment:bankWidget.holdersName')}</StyledLabel>
            <StyledValueBlock>
              {paymentData.payer?.bank_account?.name}
            </StyledValueBlock>
          </Flex>
        </ListItem>

        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel>{t('payment:bankWidget.iban')}</StyledLabel>
            <StyledValueBlock>
              {paymentData.payer?.bank_account?.iban}
            </StyledValueBlock>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel>
              {t('payment:bankWidget.paymentReference')}
            </StyledLabel>
            <StyledValueBlock>{paymentReference}</StyledValueBlock>
          </Flex>
        </ListItem>
      </StyledDetails>

      <Text color="grey">
        {t('payment:bankWidget.yapilyCopy', { name: recipient })}
      </Text>
      <Flex mt={1} flexWrap="wrap" mb="32px">
        {Object.keys(infoPanelMap).map((key, index) => (
          <Box mr={3} key={index}>
            <Button
              variant="text"
              color="grey"
              tooltip={{
                // @ts-ignore
                tip: infoPanelMap[key].tip,
              }}
            >
              {/* @ts-ignore */}
              {infoPanelMap[key].label}
            </Button>
          </Box>
        ))}
      </Flex>

      <Button type="submit" block>
        {t('payment:bankWidget.continue')}
      </Button>
    </Box>
  );
};

export default InvoiceDetails;
